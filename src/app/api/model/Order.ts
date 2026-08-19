import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    selectedColor: { type: String },
    selectedSize: { type: String },
    shirtQuality: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: { type: String, required: true },
    paymentDetails: {
      channel: { type: String },
      bank: { type: String },
      accountName: { type: String },
      accountNumber: { type: String },
      senderBank: { type: String },
      receiverBank: { type: String },
      receiverAccountNumber: { type: String },
    },
    paidAt: { type: Date },
    items: { type: [OrderItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
