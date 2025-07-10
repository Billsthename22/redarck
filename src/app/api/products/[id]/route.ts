import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

       const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('Product fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
