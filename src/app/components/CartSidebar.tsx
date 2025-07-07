'use client';

import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';
import { Plus, Minus, X } from 'lucide-react';

// Clean ₦20,000 → 20000
function cleanPrice(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[^\d.]/g, '');
  return isNaN(Number(cleaned)) ? 0 : Number(cleaned);
}

export default function CartSidebar() {
  const {
    cartItems,
    isOpen,
    toggleCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalAmount,
  } = useCart();

  const whatsappNumber = '2349155581053'; // ✅ Replace with your own number

  const handleCheckout = () => {
    const messageLines = cartItems.map(item => {
      const itemPrice = cleanPrice(item.price) * item.quantity;
      return `- ${item.title} (Qty: ${item.quantity}) - ₦${itemPrice.toLocaleString()}`;
    });

    const message = `Hello! I want to place an order:\n\n${messageLines.join('\n')}\n\nTotal: ₦${totalAmount.toLocaleString()}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[320px] bg-black text-white shadow-2xl p-4 z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-2">
        <h2 className="text-lg font-bold uppercase tracking-wide text-yellow-400">Your Cart</h2>
        <button onClick={toggleCart}>
          <X className="w-6 h-6 text-yellow-400 hover:text-yellow-500" />
        </button>
      </div>

      {/* Empty */}
      {cartItems.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-10">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 items-center border-b border-gray-700 pb-3">
              <Image
                src={item.image}
                alt={item.title}
                width={60}
                height={60}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.title}</p>

                {/* Quantity */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-400 hover:text-black text-xs"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-400 hover:text-black text-xs"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  ₦{(cleanPrice(item.price) * item.quantity).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 font-bold hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <p className="font-semibold text-sm mb-2">
            Total: <span className="text-yellow-400">₦{totalAmount.toLocaleString()}</span>
          </p>
          <button
            onClick={handleCheckout}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 mt-2 text-sm font-semibold rounded transition"
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
