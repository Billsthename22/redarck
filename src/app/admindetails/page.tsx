'use client';

import Adminnavbar from '@/app/components/Adminnavbar';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type OrderItem = {
  productId: string;
  title: string;
  selectedColor?: string;
  selectedSize?: string;
  shirtQuality?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  _id: string;
  reference: string;
  customerName: string;
  email: string;
  address: string;
  amountPaid: number;
  currency: string;
  status: string;
  paidAt?: string;
  createdAt: string;
  items: OrderItem[];
};

const csvEscape = (value: string | number | undefined) => {
  const stringValue = String(value ?? '');
  return `"${stringValue.replace(/"/g, '""')}"`;
};

export default function AdminDetailsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return orders;

    return orders.filter((order) => {
      const productNames = order.items.map((item) => item.title).join(' ');
      return [
        order.customerName,
        order.email,
        order.address,
        order.reference,
        productNames,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [orders, searchQuery]);

  const totalPaid = filteredOrders.reduce((sum, order) => sum + order.amountPaid, 0);

  const exportCsv = () => {
    const headers = [
      'Date',
      'Reference',
      'Name',
      'Email',
      'Address',
      'Amount Paid',
      'Status',
      'Product',
      'Size',
      'Color',
      'Quality',
      'Quantity',
      'Unit Price',
      'Line Total',
    ];

    const rows = filteredOrders.flatMap((order) =>
      order.items.map((item) => [
        order.paidAt ? new Date(order.paidAt).toLocaleString() : '',
        order.reference,
        order.customerName,
        order.email,
        order.address,
        order.amountPaid,
        order.status,
        item.title,
        item.selectedSize,
        item.selectedColor,
        item.shirtQuality,
        item.quantity,
        item.unitPrice,
        item.lineTotal,
      ])
    );

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => csvEscape(value)).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `redack-paid-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Adminnavbar />

      <section className="mx-auto max-w-screen-2xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-5 border-b border-zinc-800 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-red-500">Admin</p>
            <h1 className="mt-2 text-3xl font-black uppercase italic tracking-tight md:text-5xl">
              Payment Details
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-red-600 hover:text-white"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={exportCsv}
              disabled={filteredOrders.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search name, email, address, reference, product"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-4 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-red-600"
            />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Orders</p>
            <p className="mt-1 text-2xl font-black">{filteredOrders.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Amount Paid</p>
            <p className="mt-1 text-2xl font-black text-red-500">₦{totalPaid.toLocaleString()}</p>
          </div>
        </div>

        {loading ? (
          <p className="py-20 text-center text-sm uppercase tracking-widest text-zinc-500">Loading orders...</p>
        ) : error ? (
          <p className="py-20 text-center text-sm text-red-500">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="py-20 text-center text-sm uppercase tracking-widest text-zinc-500">No paid orders found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-[1200px] w-full border-collapse bg-zinc-950 text-left text-sm">
              <thead className="bg-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Address</th>
                  <th className="px-4 py-4">Products</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Reference</th>
                  <th className="px-4 py-4">Paid</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t border-zinc-800 align-top">
                    <td className="px-4 py-5">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="mt-1 text-xs text-zinc-500">{order.email}</p>
                    </td>
                    <td className="max-w-xs px-4 py-5 text-zinc-300">{order.address}</td>
                    <td className="px-4 py-5">
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={`${order._id}-${item.productId}-${index}`} className="text-xs">
                            <p className="font-bold uppercase text-white">{item.title}</p>
                            <p className="mt-1 text-zinc-500">
                              Size: {item.selectedSize || 'N/A'} | Color: {item.selectedColor || 'N/A'} | Quality: {item.shirtQuality || 'N/A'}
                            </p>
                            <p className="text-zinc-500">
                              Qty: {item.quantity} | ₦{item.lineTotal.toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-5 font-black text-red-500">₦{order.amountPaid.toLocaleString()}</td>
                    <td className="px-4 py-5 font-mono text-xs text-zinc-400">{order.reference}</td>
                    <td className="px-4 py-5 text-xs text-zinc-400">
                      {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
