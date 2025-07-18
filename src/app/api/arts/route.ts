import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Arts from '../model/Arts';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

// POST: Upload and save product
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Parse form data using NextJS built-in FormData
    const formData = await req.formData();
    // Extract fields
    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const colors = formData.get('colors') as string;                    
    // Extract files
    const mainImage = formData.get('image') as File;
    const colorImagesEntries = formData.getAll('colorImages') as File[];

    console.log('FIELDS:', { title, price, description, colors });
    console.log('FILES:', { mainImage: mainImage?.name, colorImages: colorImagesEntries.length });
    
    // Validate required fields
    if (!title || !price || !mainImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const mainImageName = `${timestamp}-${mainImage.name}`;
    const mainImagePath = path.join(uploadDir, mainImageName);
    await writeFile(mainImagePath, Buffer.from(await mainImage.arrayBuffer()));

    // Save color images with unique names
    const colorImageNames: string[] = [];
    await Promise.all(colorImagesEntries.map(async (colorImage, index) => {
      const colorImageName = `${timestamp}-color-${index}-${colorImage.name}`;
      const colorImagePath = path.join(uploadDir, colorImageName);
      await writeFile(colorImagePath, Buffer.from(await colorImage.arrayBuffer()));
      colorImageNames.push(colorImageName);
    }));

    // Create product document - FIXED: Use imageSrc instead of image
    const newArt = new Arts({
      title,
      price,
      description,
      colors: colors ? colors.split(',').map(c => c.trim()) : [], // Convert to array
      imageSrc: `/uploads/${mainImageName}`, // ✅ FIXED: Changed from 'image' to 'imageSrc'
      colorImages: colorImageNames.map(name => `/uploads/${name}`),
    });

    console.log('Creating art with imageSrc:', newArt.imageSrc); // Debug log

    // Save product to database
    const savedArt = await newArt.save();
    console.log('Saved art:', savedArt); // Debug log
    
    return NextResponse.json(savedArt, { status: 201 });
    } catch (err) {
    console.error('Art upload error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

//GET all arts
export async function GET() {
    try {
        await connectDB();
        const arts = await Arts.find({});
        console.log('Retrieved arts:', arts.map(art => ({ title: art.title, imageSrc: art.imageSrc }))); // Debug log
        return NextResponse.json(arts);
    } catch (err) {
        console.error('Arts fetch error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}