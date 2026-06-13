import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';

const TAX_RATE = 0.0875; // Simulated 8.75% tax (TaxJar would calculate this per address)

export default function Checkout() {
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal());
  const charityAmount = useStore((s) => s.cartCharityAmount());
  const clearCart = useStore((s) => s.clearCart);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    address: '', city: '', state: '', zip: '', country: 'US',
  });
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = cartTotal;
  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal >= 75 ? 0 : 7.99;
  const total = parseFloat((subtotal + taxAmount + shipping).toFixed(2));

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setPlaced(true);
    clearCart();
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link to="/marketplace" className="bg-hex-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <CheckCircle size={64} className="mx-auto text-hex-green mb-4" />
        <h2 className="text-2xl font-bold text-hex-secondary mb-2">Order Placed! 🎉</h2>
        <p className="text-gray-500 mb-4">Thank you for your order. A confirmation has been sent to {form.email}.</p>
        <div className="bg-hex-green/10 border border-hex-green/30 rounded-xl p-4 mb-6">
          <p className="text-hex-green font-semibold">💚 ${charityAmount.toFixed(2)} is being donated to charity from your order!</p>
          <Link to="/charity" className="text-sm text-hex-green underline mt-1 block">See the impact →</Link>
        </div>
        <Link to="/" className="bg-hex-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-hex-secondary mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-4 text-hex-secondary">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'firstName', label: 'First Name', colSpan: 1 },
                { name: 'lastName', label: 'Last Name', colSpan: 1 },
                { name: 'email', label: 'Email', colSpan: 2, type: 'email' },
                { name: 'address', label: 'Address', colSpan: 2 },
                { name: 'city', label: 'City', colSpan: 1 },
                { name: 'state', label: 'State', colSpan: 1 },
                { name: 'zip', label: 'ZIP Code', colSpan: 1 },
                { name: 'country', label: 'Country', colSpan: 1 },
              ].map(({ name, label, colSpan, type = 'text' }) => (
                <div key={name} className={colSpan === 2 ? 'col-span-2' : ''}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hex-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-lg mb-1 text-hex-secondary">Payment</h2>
            <p className="text-xs text-gray-400 mb-4">Demo mode — no real charge will occur</p>
            <div className="space-y-3">
              {[
                { placeholder: '1234 5678 9012 3456', label: 'Card Number' },
                { placeholder: 'MM/YY', label: 'Expiry' },
                { placeholder: 'CVV', label: 'CVV' },
              ].map(({ placeholder, label }) => (
                <div key={label}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  <input
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hex-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hex-primary hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors"
          >
            <Lock size={18} />
            {loading ? 'Processing...' : `Place Order — $${total}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4 text-hex-secondary">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-hex-green font-medium">FREE</span> : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (auto-calculated)</span><span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-hex-green font-medium">
                <span className="flex items-center gap-1"><Heart size={12} className="fill-hex-green text-hex-green" /> Charity</span>
                <span>-${charityAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span><span>${total}</span>
              </div>
            </div>

            <div className="mt-4 bg-hex-green/10 border border-hex-green/20 rounded-xl p-3">
              <p className="text-xs text-hex-green font-medium">
                💚 ${charityAmount.toFixed(2)} from this order will be donated to charity with full transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
