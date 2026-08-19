import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Order from '@/app/api/model/Order';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: 'Paystack secret key is not configured' },
      { status: 500 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature') || '';

  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex');

  if (hash !== signature) {
    return NextResponse.json(
      { error: 'Invalid Paystack signature' },
      { status: 401 }
    );
  }

  const event = JSON.parse(rawBody);

  if (
    event.event !== 'charge.success' ||
    event.data?.status !== 'success' ||
    !event.data?.reference
  ) {
    return NextResponse.json({ received: true });
  }

  const data = event.data;
  const metadata = data.metadata || {};
  const items = Array.isArray(metadata.items) ? metadata.items : [];

  await connectDB();

  await Order.findOneAndUpdate(
    { reference: data.reference },
    {
      $set: {
        reference: data.reference,
        customerName: metadata.customer_name || data.customer?.first_name || 'Customer',
        email: data.customer?.email || '',
        address: metadata.delivery_address || '',
        amountPaid: Number(data.amount || 0) / 100,
        currency: data.currency || 'NGN',
        status: data.status,
        paymentDetails: {
          channel: data.authorization?.channel || data.channel || '',
          bank: data.authorization?.bank || '',
          accountName: data.authorization?.account_name || '',
          accountNumber: data.authorization?.account_number || '',
          senderBank: data.authorization?.sender_bank || '',
          receiverBank: data.authorization?.receiver_bank || '',
          receiverAccountNumber:
            data.authorization?.receiver_bank_account_number || '',
        },
        paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
        items: items.map((item: any) => ({
          productId: item.id || '',
          title: item.title || 'Product',
          selectedColor: item.selectedColor || '',
          selectedSize: item.selectedSize || '',
          shirtQuality: item.shirtQuality || '',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          lineTotal: item.lineTotal || 0,
        })),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return NextResponse.json({ received: true });
}