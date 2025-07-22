import { NextResponse } from 'next/server';
import { connectDB } from '@/app/api/lib/mongodb';
import Arts from '../../model/Arts';
import { ObjectId } from 'mongodb';

export async function GET(
  req: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

       const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Art ID' }, { status: 400 });
    }

    const product = await Arts.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Art not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error('Art fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: Delete a Art by ID
export async function DELETE(
  req: Request,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid art ID' }, { status: 400 });
    }

    const deletedArt = await Arts.findByIdAndDelete(id);
    if (!deletedArt) {
      return NextResponse.json({ error: 'Art not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Art deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Art delete error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT: Update a Art by ID (JSON version for admindetail page)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
    
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid art ID' }, { status: 400 });
        }
    
        // ✅ Parse JSON instead of FormData
        const body = await req.json();
        const { title, price, description, colors } = body;
    
        if (!title || !price) {
            return NextResponse.json({ error: 'Missing required fields (title and price)' }, { status: 400 });
        }
    
        // ✅ Update the art document with JSON data
        const updatedArt = await Arts.findByIdAndUpdate(
            id,
            { 
                title, 
                price, 
                description: description || '', 
                colors: Array.isArray(colors) ? colors : [] 
            },
            { new: true }
        );
    
        if (!updatedArt) {
            return NextResponse.json({ error: 'Art not found' }, { status: 404 });
        }
    
        return NextResponse.json(updatedArt, { status: 200 });
    } catch (err) {
        console.error('Art update error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}