import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Heart, Trash2, ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const lineTotal = (item.price * item.quantity).toFixed(2);
  const charityLine = (
    item.price * item.quantity * ((item.charityPercent || 5) / 100)
  ).toFixed(2);

  return (
    <div className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      {/* Product image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <p className="text-sm font-semibold text-hex-secondary line-clamp-2 leading-tight">
          {item.name}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-hex-primary">${lineTotal}</span>
          <span className="text-xs text-hex-muted">(${item.price.toFixed(2)} each)</span>
        </div>

        {item.charityPercent > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-hex-green font-medium">
            <Heart size={10} fill="currentColor" />
            ${charityLine} to charity
          </span>
        )}

        {/* Quantity controls + remove */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-2 py-1.5 hover:bg-gray-100 text-hex-secondary transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 py-1.5 text-sm font-semibold text-hex-secondary min-w-[2rem] text-center border-x border-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1.5 hover:bg-gray-100 text-hex-secondary transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const isCartOpen = useStore((s) => s.isCartOpen);
  const closeCart = useStore((s) => s.closeCart);
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const cartTotal = useStore((s) => s.cartTotal());
  const cartCharityAmount = useStore((s) => s.cartCharityAmount());
  const cartCount = useStore((s) => s.cartCount());
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleBrowse = () => {
    closeCart();
    navigate('/marketplace');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-hex-secondary text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} />
            <span className="font-bold text-lg">Cart</span>
            {cartCount > 0 && (
              <span className="bg-hex-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable items area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-gray-300" />
              </div>
              <p className="text-hex-secondary font-semibold text-base mb-1">
                Your cart is empty
              </p>
              <p className="text-hex-muted text-sm mb-6">
                Discover amazing products and add them here.
              </p>
              <button
                onClick={handleBrowse}
                className="bg-hex-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        {/* Footer summary + checkout */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-hex-muted">
                Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
              </span>
              <span className="font-semibold text-hex-secondary">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Charity contribution highlighted */}
            <div className="flex items-center justify-between text-sm bg-green-50 border border-hex-green/20 rounded-lg px-3 py-2">
              <span className="flex items-center gap-1.5 text-hex-green font-semibold">
                <Heart size={13} fill="currentColor" />
                Charity donation
              </span>
              <span className="font-bold text-hex-green">
                ${cartCharityAmount.toFixed(2)}
              </span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between font-bold text-base border-t border-gray-100 pt-3">
              <span className="text-hex-secondary">Total</span>
              <span className="text-hex-secondary text-xl">${cartTotal.toFixed(2)}</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-hex-primary hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>

            <p className="text-[11px] text-center text-hex-muted">
              Tax calculated at checkout &nbsp;·&nbsp; Free shipping over $75
            </p>
          </div>
        )}
      </div>
    </>
  );
}
