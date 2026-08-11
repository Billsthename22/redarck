import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';

export const runtime = 'nodejs';

type CheckoutItem = {
  id: string;
  title?: string;
  selectedColor?: string;
  selectedSize?: string;
  shirtQuality?: string;
  quantity: number;
  productType?: string;
};

type PaystackLineItem = {
  id: string;
  title: string;
  selectedColor: string;
  selectedSize: string;
  shirtQuality: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

const cleanPrice = (raw: string | number): number => {
  const cleaned = String(raw).replace(/[^\d.]/g, '');
  const price = Number(cleaned);
  return Number.isFinite(price) ? price : 0;
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 });
    }

    const { email, name, address, items } = (await req.json()) as {
      email?: string;
      name?: string;
      address?: string;
      items?: CheckoutItem[];
    };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'A valid email address is required' }, { status: 400 });
    }

    if (!name?.trim() || !address?.trim()) {
      return NextResponse.json({ error: 'Name and delivery address are required' }, { status: 400 });
    }

    const productItems = Array.isArray(items)
      ? items.filter((item) => item.productType === 'product' && ObjectId.isValid(item.id))
      : [];

    if (productItems.length === 0) {
      return NextResponse.json({ error: 'No valid products found for checkout' }, { status: 400 });
    }

    await connectDB();

    const ids = productItems.map((item) => item.id);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const productsById = new Map(products.map((product) => [String(product._id), product]));

    const lineItems = productItems.map((item): PaystackLineItem | null => {
      const product = productsById.get(item.id);
      if (!product) return null;

      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 20));
      const basePrice = cleanPrice(product.price);
      const unitPrice = item.shirtQuality === 'Premium' ? basePrice + 7000 : basePrice;

      return {
        id: item.id,
        title: product.title,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || '',
        shirtQuality: item.shirtQuality || 'Standard',
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      };
    }).filter((item): item is PaystackLineItem => item !== null);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No matching products found for checkout' }, { status: 400 });
    }

    const amount = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

    if (amount <= 0) {
      return NextResponse.json({ error: 'Checkout amount is invalid' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || req.nextUrl.origin;
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        currency: 'NGN',
        callback_url: `${origin}/payment/success`,
        metadata: {
          customer_name: name.trim(),
          delivery_address: address.trim(),
          custom_fields: [
            {
              display_name: 'Customer Name',
              variable_name: 'customer_name',
              value: name.trim(),
            },
            {
              display_name: 'Delivery Address',
              variable_name: 'delivery_address',
              value: address.trim(),
            },
            {
              display_name: 'Order Items',
              variable_name: 'order_items',
              value: lineItems
                .map((item) => `${item.title} x${item.quantity}`)
                .join(', '),
            },
          ],
          items: lineItems,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.status || !data.data?.authorization_url) {
      return NextResponse.json(
        { error: data.message || 'Unable to initialize Paystack payment' },
        { status: response.status || 502 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json({ error: 'Unable to initialize payment' }, { status: 500 });
  }
}
