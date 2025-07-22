import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../lib/mongodb'; // Adjust path as needed
import Admin from '../model/Admin';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse the request body

    const { fullName, email, address, password } = await request.json();

    // Validate required fields
    if (!fullName || !email || !address || !password) {

    const { fullName, email, password } = await request.json();

    // Validate required fields
    if (!fullName || !email || !password) {

      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists with the provided email
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Create a new user
    const user = new Admin({
      fullName,
      email,

      address,

      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return the response with the user object (excluding password) and the token
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password; // Remove password from the response

    return NextResponse.json(
      {
        message: 'User registered successfully',
        token,
        user: userWithoutPassword,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
