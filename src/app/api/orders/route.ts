import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Order from '@/app/api/model/Order';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('========== ORDERS API START ==========');

    await connectDB();

    console.log('MongoDB connected');

    const orders = await Order.find()
      .sort({ paidAt: -1, createdAt: -1 })
      .lean();

    console.log('Orders found:', orders.length);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('========== ORDERS FETCH ERROR ==========');
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}