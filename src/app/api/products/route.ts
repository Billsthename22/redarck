import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST: Upload and save product
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const shirtQuality = formData.get('shirtQuality') as string;
    const colors = formData.get('colors') as string;
    const sizes = formData.get('sizes') as string;
    const mainImage = formData.get('image') as File;
    const colorImages = formData.getAll('colorImages') as File[];

    if (!title || !price || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save main image
    const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer());
    const mainImageName = `${Date.now()}-${mainImage.name}`;
    const mainImagePath = path.join(uploadDir, mainImageName);
    await writeFile(mainImagePath, mainImageBuffer);
    const imageSrc = `/uploads/${mainImageName}`;

    // Save color images
    const colorImagePaths: string[] = [];
    for (const file of colorImages) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${Math.random()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        colorImagePaths.push(`/uploads/${fileName}`);
      }
    }

    const product = await Product.create({
      title,
      price: parseFloat(price),
      description: description || '',
      shirtQuality: shirtQuality || '',
      colors: colors ? colors.split(',').map((c) => c.trim()) : [],
      sizes: sizes ? sizes.split(',').map((s) => s.trim()) : [],
      imageSrc,
      colorImages: colorImagePaths,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    return NextResponse.json({
      error: 'Upload failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: Fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
