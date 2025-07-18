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

// DELETE: Delete a product by ID
export async function DELETE(
  req: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Product delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

//EDIT: Update a product by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const colors = formData.get('colors') as string;
    const sizes = formData.get('sizes') as string;
    const mainImage = formData.get('image') as File;

    if (!title || !price || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        title,
        price,
        description,
        colors,
        sizes,
        image: `/uploads/${mainImage.name}`,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.error('Product update error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
