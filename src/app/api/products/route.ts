import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Product from '@/app/api/model/Product';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Get raw body from NextRequest
async function getRawBody(req: NextRequest): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks: Uint8Array[] = [];

  if (!reader) throw new Error('No body found');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

// Parse form using formidable
function parseForm(buffer: Buffer, headers: Headers): Promise<{ fields: any; files: any }> {
  const uploadDir = path.join(process.cwd(), '/public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  return new Promise((resolve, reject) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    form.parse(
      stream as any,
      Object.fromEntries(headers.entries()),
      (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      }
    );
  });
}

// POST: Upload and save product
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const buffer = await getRawBody(req);
    const { fields, files } = await parseForm(buffer, req.headers);

    console.log('FIELDS:', fields);
    console.log('FILES:', files);

    if (!fields.title || !fields.price || !files.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mainImage = Array.isArray(files.image) ? files.image[0] : files.image;
    const colorImages = Array.isArray(files.colorImages)
      ? files.colorImages
      : files.colorImages
        ? [files.colorImages]
        : [];

    const imageSrc = mainImage ? `/uploads/${path.basename(mainImage.filepath)}` : null;
    const colorImagePaths = colorImages
      .filter(Boolean)
      .map((file: any) => `/uploads/${path.basename(file.filepath)}`);

    const product = await Product.create({
      title: fields.title,
      price: fields.price,
      description: fields.description,
      colors: fields.colors?.split(',').map((c: string) => c.trim()) || [],
      sizes: fields.sizes?.split(',').map((s: string) => s.trim()) || [],
      imageSrc,
      colorImages: colorImagePaths,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
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
