import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: String,
    price: String,
    description: String,
    colors: [String],
    sizes: [String],
    imageSrc: String,
    colorImages: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
