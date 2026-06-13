import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Lock,
  CheckCircle,
  Heart,
  Truck,
  CreditCard,
  AlertCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import { calculateTax } from '../services/taxService';

const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'],
  ['CA', 'California'], ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'],
  ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'],
  ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

function InputField({ label, name, type = 'text', value, onChange, required, placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label} {required && <span className="text-hex-accent">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-hex-secondary outline-none focus:ring-2 focus:ring-hex-primary focus:border-transparent transition-shadow placeholder-gray-400"
      />
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const cartTotal = useStore((s) => s.cartTotal());
  const charityAmount = useStore((s) => s.cartCharityAmount());
  const clearCart = useStore((s) => s.clearCart);
  const setShippingAddress = useStore((s) => s.setShippingAddress);
  const setTaxAmountStore = useStore((s) => s.setTaxAmount);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
  });

  const [taxData, setTaxData] = useState({ taxAmount: 0, estimated: false, loading: false, error: null });
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);

  const subtotal = cartTotal;
  const shipping = subtotal >= 75 ? 0 : 9.99;
  const total = parseFloat((subtotal + taxData.taxAmount + shipping).toFixed(2));

  // Collect charity causes from cart items
  const charityCauses = [...new Set(cart.map((item) => item.charityCause).filter(Boolean))];

  // Trigger tax calculation when both state and zip are filled
  const fetchTax = useCallback(async (state, zip) => {
    if (!state || zip.length < 5) return;
    setTaxData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await calculateTax({
        items: cart.map((item) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        shipping_address: {
          street: form.address || '123 Main St',
          city: form.city || 'Unknown',
          state,
          zip,
          country: 'US',
        },
        shipping,
      });
      setTaxData({
        taxAmount: result.taxAmount || 0,
        estimated: result.estimated || false,
        loading: false,
        error: null,
      });
      setTaxAmountStore(result.taxAmount || 0);
    } catch {
      setTaxData((prev) => ({ ...prev, loading: false, error: 'Tax calculation unavailable.' }));
    }
  }, [cart, form.address, form.city, shipping, setTaxAmountStore]);

  useEffect(() => {
    if (form.state && form.zip.length >= 5) {
      const timeout = setTimeout(() => fetchTax(form.state, form.zip), 600);
      return () => clearTimeout(timeout);
    }
  }, [form.state, form.zip, fetchTax]);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      formatted = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCard((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip'];
    for (const field of required) {
      if (!form[field].trim()) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    setSubmitting(true);

    // Save shipping address to store
    setShippingAddress({
      street: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: 'US',
    });

    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setPlaced(true);
    clearCart();
    toast.success('Order placed! Thank you for supporting our charity causes.', {
      duration: 6000,
      icon: '🎉',
    });
    setTimeout(() => navigate('/'), 3500);
  };

  // ── Empty cart ─────────────────────────────────────────────────────────────
  if (cart.length === 0 && !placed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-hex-secondary mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Add some products to your cart before checking out.
        </p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 bg-hex-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  // ── Order placed ───────────────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle size={72} className="text-hex-green mb-4 animate-bounce" />
        <h2 className="text-3xl font-extrabold text-hex-secondary mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Thank you for your purchase. A confirmation has been sent to{' '}
          <span className="font-semibold text-hex-secondary">{form.email}</span>.
        </p>
        <div className="bg-hex-green/10 border border-hex-green/30 rounded-2xl p-5 mb-8 max-w-sm w-full">
          <div className="flex items-center gap-2 justify-center mb-1">
            <Heart size={18} className="text-hex-green" fill="currentColor" />
            <p className="text-hex-green font-bold text-base">
              ${charityAmount.toFixed(2)} donated to charity
            </p>
          </div>
          <p className="text-hex-green/70 text-xs mt-1">
            Your order supports {charityCauses.join(', ') || 'our charity causes'}.
          </p>
          <Link to="/charity" className="text-sm text-hex-green underline font-medium block mt-2">
            See the impact →
          </Link>
        </div>
        <Link
          to="/"
          className="bg-hex-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // ── Main checkout ──────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Lock size={20} className="text-hex-primary" />
          <h1 className="text-2xl font-extrabold text-hex-secondary">Secure Checkout</h1>
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
            <Lock size={11} />
            256-bit SSL
          </span>
        </div>

        {/* Mobile: Order summary on top */}
        <div className="block lg:hidden mb-6">
          <MobileOrderSummary
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            taxData={taxData}
            charityAmount={charityAmount}
            total={total}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Forms ──────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">

            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Truck size={18} className="text-hex-primary" />
                <h2 className="font-bold text-lg text-hex-secondary">Shipping Information</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleFormChange}
                  required
                  placeholder="John"
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleFormChange}
                  required
                  placeholder="Doe"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                  placeholder="john@example.com"
                  className="col-span-2"
                />
                <InputField
                  label="Street Address"
                  name="address"
                  value={form.address}
                  onChange={handleFormChange}
                  required
                  placeholder="123 Main St"
                  className="col-span-2"
                />
                <InputField
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  required
                  placeholder="New York"
                />
                {/* State select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    State <span className="text-hex-accent">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleFormChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-hex-secondary outline-none focus:ring-2 focus:ring-hex-primary focus:border-transparent transition-shadow appearance-none bg-white pr-8"
                    >
                      <option value="">Select state…</option>
                      {US_STATES.map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <InputField
                  label="ZIP Code"
                  name="zip"
                  value={form.zip}
                  onChange={handleFormChange}
                  required
                  placeholder="10001"
                />

                {/* Tax calculation indicator */}
                {(form.state || form.zip) && (
                  <div className="col-span-2">
                    {taxData.loading && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Loader2 size={12} className="animate-spin text-hex-primary" />
                        Calculating tax for {form.state || '—'} {form.zip}…
                      </div>
                    )}
                    {!taxData.loading && taxData.taxAmount > 0 && (
                      <div className="flex items-center gap-2 text-xs text-hex-green font-medium">
                        <CheckCircle size={12} />
                        Tax calculated: ${taxData.taxAmount.toFixed(2)}
                        {taxData.estimated && (
                          <span className="text-gray-400 font-normal">(estimated)</span>
                        )}
                      </div>
                    )}
                    {taxData.error && (
                      <div className="flex items-center gap-2 text-xs text-red-500">
                        <AlertCircle size={12} />
                        {taxData.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={18} className="text-hex-primary" />
                <h2 className="font-bold text-lg text-hex-secondary">Payment</h2>
              </div>
              <p className="text-xs text-gray-400 mb-5 ml-7">
                Demo mode — no real charge will occur
              </p>

              {/* Mock card form */}
              <div className="bg-gradient-to-br from-hex-secondary to-[#2d2d4e] rounded-2xl p-5 mb-5 shadow-inner">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-white/50 text-xs font-medium uppercase tracking-widest">
                    DiscoverHEX
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                    <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-80 -ml-2" />
                  </div>
                </div>
                <p className="text-white font-mono text-lg tracking-widest mb-4">
                  {card.number || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">Expires</p>
                    <p className="text-white font-mono text-sm">{card.expiry || 'MM/YY'}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">CVV</p>
                    <p className="text-white font-mono text-sm">{card.cvv ? '•'.repeat(card.cvv.length) : '•••'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={card.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-hex-secondary outline-none focus:ring-2 focus:ring-hex-primary focus:border-transparent transition-shadow placeholder-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={card.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-hex-secondary outline-none focus:ring-2 focus:ring-hex-primary focus:border-transparent transition-shadow placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={card.cvv}
                      onChange={handleCardChange}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono text-hex-secondary outline-none focus:ring-2 focus:ring-hex-primary focus:border-transparent transition-shadow placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Charity impact banner */}
            {charityAmount > 0 && (
              <div className="bg-hex-green/10 border border-hex-green/30 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Heart size={22} className="text-hex-green flex-shrink-0 mt-0.5" fill="currentColor" />
                  <div>
                    <p className="text-hex-green font-bold text-sm">
                      Your order donates ${charityAmount.toFixed(2)} to charity!
                    </p>
                    {charityCauses.length > 0 && (
                      <p className="text-hex-green/70 text-xs mt-1">
                        Supporting: {charityCauses.join(' • ')}
                      </p>
                    )}
                    <Link
                      to="/charity"
                      className="text-xs text-hex-green underline font-medium block mt-1"
                    >
                      Learn about our causes →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-hex-primary hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 text-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Place Order — ${total.toFixed(2)}
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              By placing your order you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          {/* ── Right: Order Summary (desktop) ───────────────────────────── */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-lg text-hex-secondary mb-4">Order Summary</h2>

              {/* Cart items */}
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-hex-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.category}</p>
                    </div>
                    <p className="text-sm font-bold text-hex-secondary flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-hex-green font-semibold">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    Tax
                    {taxData.loading && (
                      <Loader2 size={11} className="animate-spin text-hex-primary" />
                    )}
                    {taxData.estimated && !taxData.loading && (
                      <span className="text-[10px] text-gray-400">(est.)</span>
                    )}
                  </span>
                  <span>${taxData.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-hex-green font-medium">
                  <span className="flex items-center gap-1">
                    <Heart size={12} fill="currentColor" className="text-hex-green" />
                    Charity
                  </span>
                  <span className="text-hex-green">+${charityAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base border-t pt-3 text-hex-secondary">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 75 && (
                <div className="mt-4 bg-hex-primary/10 border border-hex-primary/20 rounded-xl p-3">
                  <p className="text-xs text-hex-primary font-medium flex items-center gap-1">
                    <Truck size={12} />
                    Add ${(75 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              {charityAmount > 0 && (
                <div className="mt-3 bg-hex-green/10 border border-hex-green/20 rounded-xl p-3">
                  <p className="text-xs text-hex-green font-medium">
                    💚 ${charityAmount.toFixed(2)} from this order will be donated to verified
                    charities with full transparency.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile order summary (collapsed) ─────────────────────────────────────────
function MobileOrderSummary({ cart, subtotal, shipping, taxData, charityAmount, total }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <span className="font-bold text-hex-secondary flex items-center gap-2">
          <ShoppingBag size={16} className="text-hex-primary" />
          Order Summary ({cart.length} item{cart.length !== 1 ? 's' : ''})
        </span>
        <span className="flex items-center gap-2">
          <span className="font-extrabold text-hex-primary">${total.toFixed(2)}</span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {expanded && (
        <div className="mt-4">
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-hex-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                </div>
                <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? <span className="text-hex-green font-medium">FREE</span>
                  : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax{taxData.estimated ? ' (est.)' : ''}</span>
              <span>${taxData.taxAmount.toFixed(2)}</span>
            </div>
            {charityAmount > 0 && (
              <div className="flex justify-between text-hex-green font-medium">
                <span className="flex items-center gap-1">
                  <Heart size={11} fill="currentColor" /> Charity
                </span>
                <span>+${charityAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
