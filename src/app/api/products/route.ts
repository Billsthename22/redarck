import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import cloudinary from '../lib/cloudinary';

export const runtime = 'nodejs'; // ensure Node runtime, not Edge

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

    const imageFile = formData.get('image') as File;
    const colorImageFiles = formData.getAll('colorImages') as File[];

    if (!title || !price || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upload main image to Cloudinary
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const mainUpload = await cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
      if (error || !result) throw new Error('Cloudinary upload failed');
    });

    const mainImageUpload = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products/main' },
        (error, result) => {
          if (error || !result) reject(error || new Error('Main image upload failed'));
          else resolve(result);
        }
      );
      uploadStream.end(imageBuffer);
    });

    // Upload color images to Cloudinary
    const colorImageUrls: string[] = [];

    for (const file of colorImageFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products/colors' },
            (error, result) => {
              if (error || !result) reject(error || new Error('Color image upload failed'));
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        colorImageUrls.push(uploaded.secure_url);
      }
    }

    // Save to MongoDB
    const product = await Product.create({
      title,
      price: parseFloat(price),
      description: description || '',
      shirtQuality: shirtQuality || '',
      colors: colors ? colors.split(',').map((c) => c.trim()) : [],
      sizes: sizes ? sizes.split(',').map((s) => s.trim()) : [],
      imageSrc: mainImageUpload.secure_url,
      colorImages: colorImageUrls,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error('❌ Upload failed:', err);
    return NextResponse.json({
      error: 'Upload failed',
      message: err.message,
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
