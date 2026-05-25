'use client';

import { useState, useRef } from 'react';
import { Menu, X, Home, ShoppingBag, Info, Phone } from 'lucide-react'; 
import Link from 'next/link';
import Footer from '../components/Footer';

export default function CustomOrderPage() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Shop', href: '/shop', icon: <ShoppingBag size={18} /> },
    { name: 'About', href: '/about', icon: <Info size={18} /> },
    { name: 'Contact', href: '/contact', icon: <Phone size={18} /> },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, quantity, wearType, colours, quality, dueDate, email, phone } = form;
    const message = `Hello, I'd like to place an order:%0A%0A🔹 Name: ${fullName}%0A🔹 Type: ${wearType}%0A🔹 Qty: ${quantity}%0A🔹 Quality: ${quality}%0A🔹 Due: ${dueDate}%0A${imagePreview ? '%0A🖼️ *Inspiration image ready to send!*' : ''}`;
    window.open(`https://wa.me/2348110749341?text=${encodeURI(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-sans">
      
      {/* --- Floating Navigation --- */}
      <nav className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-4 bg-red-600 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center border border-white/10"
        >
          {isNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Dropdown Menu */}
        {isNavOpen && (
          <div className="absolute top-16 right-0 w-48 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="flex items-center gap-3 px-5 py-4 hover:bg-red-600/20 transition-colors border-b border-white/5 last:border-none"
                onClick={() => setIsNavOpen(false)}
              >
                <span className="text-red-500">{link.icon}</span>
                <span className="text-sm font-medium tracking-wide uppercase">{link.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-grow flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-md p-6 md:p-12 rounded-3xl shadow-2xl">
          
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-koulen tracking-wider text-white uppercase italic">
              Custom <span className="text-red-600">Order</span>
            </h1>
            <div className="h-1 w-20 bg-red-600 mt-2 mb-4"></div>
            <p className="text-zinc-400">Precision manufacturing for your custom apparel.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 01. Visual Inspiration */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-red-500">01. Visual Inspiration (Optional)</p>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer border-2 border-dashed border-zinc-700 hover:border-red-600/50 bg-zinc-800/30 rounded-2xl p-8 transition-all flex flex-col items-center justify-center"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 bg-zinc-700 group-hover:bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                      <Menu size={20} className="rotate-90" /> {/* Mimicking an upload icon */}
                    </div>
                    <p className="text-zinc-400 text-sm">Upload Reference Image</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
            </div>

            {/* 02. Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">02. Project Details</p>
              </div>
              <input name="wearType" placeholder="Type (e.g. T-Shirt)" value={form.wearType} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all" />
              <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all" />
              <select name="quality" value={form.quality} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all appearance-none">
                <option value="" className="bg-zinc-900">Select Quality</option>
                <option value="Standard" className="bg-zinc-900">Standard</option>
                <option value="Premium" className="bg-zinc-900">Premium</option>
              </select>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all" />
            </div>

            {/* 03. Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800">
              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">03. Personal Info</p>
              </div>
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all md:col-span-2" />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all" />
              <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all" />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all transform hover:scale-[1.01] shadow-lg shadow-red-900/20"
            >
              Submit Order
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}