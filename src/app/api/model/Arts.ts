
import mongoose from 'mongoose';

const artSchema = new mongoose.Schema({
    
    title: String,
  price: String,
  description: String,
  colors: [String],
  imageSrc: String, // ✅ Should be imageSrc
  colorImages: [String],
  },
  { timestamps: true }
);
export default mongoose.models.Art || mongoose.model('Art', artSchema);