import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String },
    shirtQuality: { type: String }, // Optional shirt quality field
    colors: [{ type: String }], // ✅ Array of strings for multiple colors
    sizes: [{ type: String }],   // ✅ Array of strings for multiple sizes
    imageSrc: { type: String },  // Main product image
    colorImages: [{ type: String }], // Array of color image URLs
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
