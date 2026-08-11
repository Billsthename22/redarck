import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Order from '@/app/api/model/Order';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ paidAt: -1, createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
