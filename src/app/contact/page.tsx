'use client';
import Navbar from '../components/Navbar';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong.');
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
        <h2 className="text-center font-[koulen] text-[48px] sm:text-[64px] mb-6">Contact Us</h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full p-3 rounded bg-gray-800 text-white outline-none font-[koulen] text-[18px]"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full p-3 rounded bg-gray-800 text-white outline-none font-[koulen] text-[18px]"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none font-[koulen] text-[18px]"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-[koulen] text-[20px] transition"
          >
            Send Message
          </button>

          {status && (
            <p className="text-center text-[16px] text-white mt-4">{status}</p>
          )}
        </form>
      </section>
    </>
  );
}
