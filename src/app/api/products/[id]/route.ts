import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { ObjectId } from 'mongodb';

// GET product by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop() as string;

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

// DELETE product by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop() as string;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT product update by ID
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop() as string;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await req.json();
    const { title, price, description, colors, sizes } = body;

    if (!title || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = { title, price, description, colors, sizes };

    const updated = await Product.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
