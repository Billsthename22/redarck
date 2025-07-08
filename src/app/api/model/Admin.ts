import mongoose from 'mongoose';

export interface IAdmin {
  fullName: string;
  email: string;

  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, {
  timestamps: true
});

// Prevent re-compilation during development
const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
