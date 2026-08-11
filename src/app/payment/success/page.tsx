'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your payment...');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference was found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Unable to confirm payment.');
        }

        setStatus('success');
        setMessage('Payment confirmed. Your order has been recorded.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Unable to confirm payment.');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-8 text-center space-y-6 rounded-2xl">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-red-500 font-bold">
            {status === 'loading' ? 'Processing' : status === 'success' ? 'Confirmed' : 'Attention'}
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase italic">
            {status === 'success' ? 'Payment Successful' : status === 'error' ? 'Payment Check Failed' : 'Please Wait'}
          </h1>
        </div>

        <p className="text-sm text-zinc-400">{message}</p>
        {reference && <p className="text-xs text-zinc-600 break-all">Reference: {reference}</p>}

        <Link
          href="/shop"
          className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 py-4 text-sm font-black uppercase text-black transition-colors hover:bg-red-700"
        >
          Back to Shop
        </Link>
      </section>
    </main>
  );
}
