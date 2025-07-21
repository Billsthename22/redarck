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

// Generate unique key for cart items (must match your cart context)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateCartKey = (item: any): string => {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`;
};

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

  const whatsappNumber = '2348012345678'; 

  const handleCheckout = () => {
    const messageLines = cartItems.map(item => {
      const itemPrice = cleanPrice(item.price) * item.quantity;
      let itemDetails = `${item.title}`;
      
      // Add color and size if available
      if (item.selectedColor) itemDetails += ` - Color: ${item.selectedColor}`;
      if (item.selectedSize) itemDetails += ` - Size: ${item.selectedSize}`;
      
      return `- ${itemDetails} (Qty: ${item.quantity}) - ₦${itemPrice.toLocaleString()}`;
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
        <h2 className="text-lg font-bold uppercase tracking-wide text-red-400">Your Cart</h2>
        <button onClick={toggleCart}>
          <X className="w-6 h-6 text-red-400 hover:text-red-500" />
        </button>
      </div>

      {/* Empty */}
      {cartItems.length === 0 ? (
        <p className="text-gray-400 text-sm text-center mt-10">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {cartItems.map((item, index) => {
            const cartKey = generateCartKey(item);
            return (
              <div key={`${cartKey}-${index}`} className="flex gap-3 items-start border-b border-gray-700 pb-3">
                <Image
                  src={item.image || item.imageSrc || '/placeholder.png'}
                  alt={item.title || 'Product'}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.png';
                  }}
                />
                <div className="flex-1">
                  {/* Product Title */}
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  
                  {/* Product Description */}
                  {item.description && (
                    <p className="text-xs text-white-400 mb-2 line-clamp-6">
                      {item.description}
                    </p>
                  )}

                  {/* Selected Variants */}
                  {(item.selectedColor || item.selectedSize) && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.selectedColor && (
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                          Color: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <p className="text-sm font-semibold text-white-400 mb-2">
                    {item.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        console.log('Decreasing:', cartKey);
                        decreaseQty(cartKey);
                      }}
                      className="px-2 py-1 border border-red-400 text-white-400 rounded hover:bg-red-200 hover:text-black text-xs"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => {
                        console.log('Increasing:', cartKey);
                        increaseQty(cartKey);
                      }}
                      className="px-2 py-1 border border-red-400 text-white-400 rounded hover:bg-red-200 hover:text-black text-xs"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-xs text-gray-300 mt-2">
                    Subtotal: ₦{(cleanPrice(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    console.log('Removing:', cartKey);
                    removeFromCart(cartKey);
                  }}
                  className="text-red-500 font-bold hover:text-red-400 ml-2"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="mt-6 border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            <span className="font-semibold text-red-400">
              Total: ₦{totalAmount.toLocaleString()}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-red-500 hover:bg-red-700 text-black py-2 mt-2 text-sm font-semibold rounded transition"
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
}