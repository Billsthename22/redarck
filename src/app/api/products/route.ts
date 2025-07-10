import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
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
    const sizes = formData.get('sizes') as string;
    
    // Extract files
    const mainImage = formData.get('image') as File;
    const colorImagesEntries = formData.getAll('colorImages') as File[];

    console.log('FIELDS:', { title, price, description, colors, sizes });
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

    // Save main image
    let imageSrc = null;
    if (mainImage && mainImage.size > 0) {
      const mainImageBuffer = Buffer.from(await mainImage.arrayBuffer());
      const mainImageName = `${Date.now()}-${mainImage.name}`;
      const mainImagePath = path.join(uploadDir, mainImageName);
      
      await writeFile(mainImagePath, mainImageBuffer);
      imageSrc = `/uploads/${mainImageName}`;
    }

    // Save color images
    const colorImagePaths: string[] = [];
    for (const file of colorImagesEntries) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${Math.random()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        await writeFile(filePath, buffer);
        colorImagePaths.push(`/uploads/${fileName}`);
      }
    }

    // Create product
    const product = await Product.create({
      title,
      price: parseFloat(price),
      description: description || '',
      colors: colors ? colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      sizes: sizes ? sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
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