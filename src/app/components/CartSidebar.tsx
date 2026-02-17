'use client';

import { useCart } from '@/app/Context/cartcontext';
import Image from 'next/image';
import { Plus, Minus, X, ShoppingBag, Trash2 } from 'lucide-react';

function cleanPrice(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[₦,]/g, '').trim();
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

  const whatsappNumber = '2348110749341';

  const handleCheckout = () => {
    const messageLines = cartItems.map(item => {
      const itemPrice = cleanPrice(item.price) * item.quantity;
      let itemDetails = `${item.title}`;
      if (item.selectedColor) itemDetails += ` - Color: ${item.selectedColor}`;
      if (item.selectedSize) itemDetails += ` - Size: ${item.selectedSize}`;
      return `- ${itemDetails} (Qty: ${item.quantity}) - ₦${itemPrice.toLocaleString()}`;
    });

    const message = `Hello Redack Nation! ⚡️\nI'd like to place an order:\n\n${messageLines.join('\n')}\n\nTotal: ₦${totalAmount.toLocaleString()}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-[#0a0a0a] border-l border-zinc-800 text-white shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-[70] transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-6 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Your <span className="text-red-600">Cart</span></h2>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-zinc-900 rounded-full transition-colors group"
          >
            <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <ShoppingBag size={48} className="mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.cartKey || index}
                className="group relative flex gap-4 bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-2xl hover:border-zinc-700 transition-all"
              >
                <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={item.image || item.imageSrc || '/placeholder.png'}
                    alt={item.title || 'Product'}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold uppercase tracking-tight line-clamp-1">{item.title}</h3>
                    <button
                      onClick={() => removeFromCart(item.cartKey!)}
                      className="text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Options Badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.selectedSize && (
                      <span className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 uppercase">Size: {item.selectedSize}</span>
                    )}
                    {item.selectedColor && (
                      <span className="text-[10px] font-bold bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 uppercase">Color: {item.selectedColor}</span>
                    )}
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex items-center bg-black border border-zinc-800 rounded-full p-1">
                      <button
                        onClick={() => decreaseQty(item.cartKey!)}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item.cartKey!)}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-black text-white">
                      ₦{(cleanPrice(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Subtotal</span>
              <span className="text-xl font-black text-red-600">₦{totalAmount.toLocaleString()}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="group relative w-full overflow-hidden rounded-xl bg-red-600 py-4 font-black uppercase italic tracking-tighter transition-all hover:bg-red-700 active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-black">
                Checkout on WhatsApp
                <span className="bg-black text-red-600 text-[10px] px-2 py-0.5 rounded-full group-hover:scale-110 transition-transform">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </span>
            </button>
            <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest italic">
              Payment will be finalized via DM
            </p>
          </div>
        )}
      </div>
    </>
  );
}