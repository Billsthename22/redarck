'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
export default function CustomOrderPage() {
  const [form, setForm] = useState({
    fullName: '',
    companyName: '',
    quantity: '',
    wearType: '',
    colours: '',
    quality: '',
    dueDate: '',
    email: '',
    phone: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const {
      fullName,
      companyName,
      quantity,
      wearType,
      colours,
      quality,
      dueDate,
      email,
      phone,
    } = form;

    const message = `Hello, I would like to place my order:%0A%0A
🔹 Full Name: ${fullName}
🔹 Company Name: ${companyName || 'N/A'}
🔹 Quantity: ${quantity}
🔹 Type of Wear: ${wearType}
🔹 Colours: ${colours || 'N/A'}
🔹 Quality: ${quality}
🔹 Due Date: ${dueDate}
🔹 Email: ${email}
🔹 Phone Number: ${phone}`;

    const phoneNumber = '2348110749341';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURI(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
     <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-zinc-900 p-8 rounded-2xl shadow-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-koulen text-white mb-2">
            Custom Order Menu
          </h1>
          <p className="text-sm text-gray-400">Fill the details to request your order</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* existing fields */}
          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Company Name (if any)</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">How many?</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Quantity"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">What type of wear?</label>
            <input
              type="text"
              name="wearType"
              value={form.wearType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. T-shirts, Hoodies"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Colours?</label>
            <input
              type="text"
              name="colours"
              value={form.colours}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Black, Red"
            />
          </div>

          {/* ✅ Quality Field */}
          <div>
  <label className="block text-gray-300 mb-1">Quality</label>
  <select
    name="quality"
    value={form.quality}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
  >
    <option value="">Select Quality</option>
    <option value="Standard">Standard</option>
    <option value="Premium">Premium</option>
  </select>
</div>


          <div>
            <label className="block text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="+234..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}