import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Order from '@/app/api/model/Order';
import { rateLimit } from '@/app/api/lib/rateLimit';

export const runtime = 'nodejs';

type VerifiedItem = {
  id: string;
  title: string;
  selectedColor: string;
  selectedSize: string;
  shirtQuality: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export async function GET(req: NextRequest) {
  try {
    const limited = rateLimit(req, {
      keyPrefix: 'paystack-verify',
      limit: 30,
      windowMs: 10 * 60 * 1000,
    });
    if (limited) return limited;

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const reference = req.nextUrl.searchParams.get('reference');

    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack secret key is not configured' }, { status: 500 });
    }

    if (!reference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
    }

    await connectDB();

    const existingOrder = await Order.findOne({ reference });
    if (existingOrder) {
      return NextResponse.json({ order: existingOrder });
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });
    const payload = await response.json();

    if (!response.ok || !payload.status || payload.data?.status !== 'success') {
      return NextResponse.json(
        { error: payload.message || 'Payment has not been confirmed' },
        { status: response.status || 400 }
      );
    }

    const data = payload.data;
    const metadata = data.metadata || {};
    const items = Array.isArray(metadata.items) ? metadata.items : [];

    const order = await Order.create({
      reference: data.reference,
      customerName: metadata.customer_name || data.customer?.first_name || 'Customer',
      email: data.customer?.email || data.authorization?.receiver_bank_account_number || '',
      address: metadata.delivery_address || '',
      amountPaid: Number(data.amount || 0) / 100,
      currency: data.currency || 'NGN',
      status: data.status,
      paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
      items: items.map((item: VerifiedItem) => ({
        productId: item.id,
        title: item.title,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        shirtQuality: item.shirtQuality,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Paystack verify error:', error);
    return NextResponse.json({ error: 'Unable to verify payment' }, { status: 500 });
  }
}
