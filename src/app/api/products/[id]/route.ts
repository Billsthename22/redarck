/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { ObjectId } from 'mongodb';

// GET product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

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
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT product update by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const shirtQuality = formData.get('shirtQuality') as string;
    const colors = formData.get('colors') as string;
    const sizes = formData.get('sizes') as string;
    const mainImage = formData.get('image') as File;

    // Only title and price are required
    if (!title || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatePayload: any = {
      title,
      price,
      description,
      shirtQuality,
      colors: colors ? colors.split(',').map(c => c.trim()) : [],
      sizes: sizes ? sizes.split(',').map(s => s.trim()) : [],
    };

    if (mainImage && mainImage.size > 0) {
      updatePayload.imageSrc = `/uploads/${mainImage.name}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error('Product update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
