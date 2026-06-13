import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  Shield,
  Truck,
  Heart,
  Share2,
  ChevronLeft,
  Check,
  MapPin,
  Award,
  Zap,
  Package,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useStore from '../store/useStore';
import { products } from '../data/mockData';
import ProductCard from '../components/marketplace/ProductCard';

// ── Star rating renderer ────────────────────────────────────────────────────
function StarRating({ rating, size = 18 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating > star - 1;
        return (
          <span
            key={star}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star size={size} className="text-gray-200" fill="currentColor" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={size} className="text-hex-gold" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Color swatch mock data keyed by tag / category ──────────────────────────
const COLOR_SWATCHES = {
  default: [
    { label: 'Midnight Black', hex: '#1A1A2E' },
    { label: 'Coral Orange', hex: '#FF6B35' },
    { label: 'Steel Grey', hex: '#7F8C8D' },
    { label: 'Forest Green', hex: '#27AE60' },
  ],
  fitness: [
    { label: 'Power Black', hex: '#1A1A2E' },
    { label: 'Energy Orange', hex: '#FF6B35' },
    { label: 'Ice Blue', hex: '#3498DB' },
  ],
  outdoor: [
    { label: 'Olive Green', hex: '#6B7C45' },
    { label: 'Desert Sand', hex: '#C2956C' },
    { label: 'Sky Blue', hex: '#5DADE2' },
  ],
  gadgets: [
    { label: 'Space Grey', hex: '#808B96' },
    { label: 'Pearl White', hex: '#F2F3F4' },
    { label: 'Midnight', hex: '#1A1A2E' },
  ],
  lifestyle: [
    { label: 'Brushed Silver', hex: '#AAB7B8' },
    { label: 'Rose Gold', hex: '#C9956C' },
    { label: 'Onyx', hex: '#17202A' },
  ],
  sports: [
    { label: 'Competition Red', hex: '#E94560' },
    { label: 'Pro Black', hex: '#1A1A2E' },
    { label: 'Arctic White', hex: '#F0F3F4' },
  ],
  health: [
    { label: 'Calm Blue', hex: '#3498DB' },
    { label: 'Wellness White', hex: '#ECF0F1' },
    { label: 'Sage Green', hex: '#27AE60' },
  ],
};

function getSwatches(tags, category) {
  if (tags) {
    for (const tag of tags) {
      if (COLOR_SWATCHES[tag]) return COLOR_SWATCHES[tag];
    }
  }
  return COLOR_SWATCHES[category] || COLOR_SWATCHES.default;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const openCart = useStore((s) => s.openCart);

  const product = products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-3xl font-extrabold text-hex-secondary mb-3">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          We couldn&apos;t find the product you&apos;re looking for. It may have been removed or
          the link is incorrect.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-hex-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <ChevronLeft size={18} />
            Go Back
          </button>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 border-2 border-hex-primary text-hex-primary font-bold px-6 py-3 rounded-xl hover:bg-hex-primary hover:text-white transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const charityDonation = (
    (product.price * quantity * (product.charityPercent || 5)) /
    100
  ).toFixed(2);

  // Pad images array so there are always at least 4 thumbnails
  const images =
    product.images.length >= 2
      ? product.images
      : [
          product.images[0],
          product.images[0] + '&crop=entropy',
          product.images[0] + '&crop=faces',
          product.images[0] + '&crop=center',
        ];

  const swatches = getSwatches(product.tags, product.category);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { fontWeight: '600' },
    });
    openCart();
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on DiscoverHEX — ${product.charityPercent}% goes to charity!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-hex-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-hex-primary transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-hex-secondary font-medium capitalize">
            {product.category}
          </span>
          <span>/</span>
          <span className="text-hex-secondary font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* ── Main product section ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT: Image gallery */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-md aspect-square">
              <img
                src={images[activeImage]}
                alt={`${product.name} — view ${activeImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Top-left badge stack */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="inline-flex items-center gap-1.5 bg-hex-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Award size={11} />
                    {product.badge}
                  </span>
                )}
                {discount && discount > 0 && (
                  <span className="bg-hex-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Sponsored overlay */}
              {product.sponsored && (
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 bg-hex-secondary/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Zap size={12} className="text-hex-gold" />
                    Sponsored by {product.sponsorName}
                  </span>
                </div>
              )}

              {/* Out of stock overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-hex-secondary text-sm font-bold px-4 py-2 rounded-full shadow">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === idx
                      ? 'border-hex-primary shadow-md scale-105'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="flex flex-col gap-5">
            {/* Category + sponsored pill row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-hex-primary uppercase tracking-widest bg-hex-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              {product.sponsored && (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1">
                  <Award size={11} />
                  {product.sponsorName}
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-hex-secondary leading-tight">
              {product.name}
            </h1>

            {/* Rating row */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-bold text-hex-secondary">{product.rating}</span>
              <span className="text-sm text-gray-400">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-hex-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  {discount && (
                    <span className="bg-hex-accent/10 text-hex-accent text-sm font-bold px-2.5 py-1 rounded-full">
                      Save {discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Charity badge */}
            <div className="bg-hex-green/10 border border-hex-green/30 rounded-xl p-4 flex items-start gap-3">
              <Heart
                size={20}
                className="text-hex-green flex-shrink-0 mt-0.5"
                fill="currentColor"
              />
              <div>
                <p className="text-hex-green font-bold text-sm">
                  Donates ${charityDonation} to {product.charityCause}
                </p>
                <p className="text-gray-600 text-xs mt-0.5">
                  {product.charityPercent}% of every purchase goes directly to this cause.{' '}
                  <Link to="/charity" className="text-hex-green underline font-medium">
                    See full impact →
                  </Link>
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            {/* Color selector */}
            <div>
              <p className="text-sm font-semibold text-hex-secondary mb-2">
                Color:{' '}
                <span className="font-normal text-gray-500">{swatches[selectedColor].label}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {swatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    title={swatch.label}
                    className={`w-9 h-9 rounded-full border-4 transition-all duration-200 ${
                      selectedColor === idx
                        ? 'border-hex-primary scale-110 shadow-md'
                        : 'border-white shadow hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: swatch.hex,
                      outline: '2px solid #e5e7eb',
                    }}
                    aria-label={swatch.label}
                    aria-pressed={selectedColor === idx}
                  />
                ))}
              </div>
            </div>

            {/* Quantity selector */}
            <div>
              <p className="text-sm font-semibold text-hex-secondary mb-2">Quantity</p>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-xl border border-gray-200 text-hex-secondary font-bold text-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-14 h-10 flex items-center justify-center border-t border-b border-gray-200 text-hex-secondary font-bold text-base bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-xl border border-gray-200 text-hex-secondary font-bold text-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="ml-3 text-xs text-gray-400">Max 10 per order</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-200 ${
                  product.inStock
                    ? 'bg-hex-primary text-white hover:bg-orange-600 active:scale-95 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                {product.inStock
                  ? `Add to Cart — $${(product.price * quantity).toFixed(2)}`
                  : 'Out of Stock'}
              </button>
              <button
                onClick={handleShare}
                className="w-14 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-hex-primary hover:text-hex-primary text-gray-500 rounded-xl transition-all duration-200"
                aria-label="Share product"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check size={14} className="text-hex-green" />
                  <span className="text-xs font-semibold text-hex-green">
                    In Stock — Ships within 1-2 business days
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-red-500">
                  Currently out of stock
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield size={14} className="text-hex-green" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={14} className="text-hex-primary" />
                Free Shipping $75+
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Package size={14} className="text-hex-accent" />
                30-Day Returns
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={14} className="text-purple-500" />
                Ships from USA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tags ──────────────────────────────────────────────────────────────── */}
      {product.tags && product.tags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white border border-gray-200 text-gray-500 text-xs font-medium px-3 py-1 rounded-full hover:border-hex-primary hover:text-hex-primary transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── You might also like ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-hex-secondary">You Might Also Like</h2>
            <Link
              to="/marketplace"
              className="text-sm font-semibold text-hex-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
