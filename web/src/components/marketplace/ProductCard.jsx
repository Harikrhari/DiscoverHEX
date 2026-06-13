import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Award, Zap } from 'lucide-react';
import useStore from '../../store/useStore';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating > star - 1 && rating < star;
        return (
          <span key={star} className="relative inline-block w-3.5 h-3.5">
            <Star size={14} className="text-gray-200" fill="currentColor" />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${(rating % 1) * 100}%` }}
              >
                <Star size={14} className="text-hex-gold" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function ProductCard({ product, onAddToCart }) {
  const addToCartStore = useStore((s) => s.addToCart);

  const {
    id,
    name,
    category,
    price,
    originalPrice,
    images,
    rating,
    reviews,
    charityPercent,
    charityCause,
    sponsored,
    sponsorName,
    badge,
    inStock,
  } = product;

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCartStore(product, 1);
    }
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-left badges stacked */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badge && (
            <span className="inline-flex items-center gap-1 bg-hex-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              <Award size={10} />
              {badge}
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-hex-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Sponsored badge bottom-left */}
        {sponsored && sponsorName && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-hex-secondary/75 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Zap size={9} className="text-hex-gold" />
            Sponsored · {sponsorName}
          </span>
        )}

        {/* Out-of-stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-hex-secondary text-xs font-bold px-3 py-1 rounded-full shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist button (decorative) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Save to wishlist"
          className="absolute top-2 right-2 p-1.5 bg-white/85 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-white"
        >
          <Heart size={13} className="text-hex-accent" />
        </button>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category label */}
        <span className="text-[10px] font-semibold text-hex-primary uppercase tracking-widest">
          {category}
        </span>

        {/* Product name */}
        <h3 className="text-sm font-semibold text-hex-secondary leading-snug line-clamp-2 group-hover:text-hex-primary transition-colors duration-200">
          {name}
        </h3>

        {/* Star rating + count */}
        <div className="flex items-center gap-1.5">
          <StarRating rating={rating} />
          <span className="text-xs font-bold text-hex-secondary">{rating}</span>
          <span className="text-xs text-hex-muted">({reviews.toLocaleString()})</span>
        </div>

        {/* Charity badge */}
        {charityPercent > 0 && (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 bg-hex-green/10 text-hex-green text-[11px] font-semibold px-2 py-0.5 rounded-full border border-hex-green/25">
              <Heart size={10} fill="currentColor" />
              {charityPercent}% to charity
            </span>
          </div>
        )}

        {/* Spacer pushes price + button to bottom */}
        <div className="flex-1" />

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-extrabold text-hex-secondary">
            ${price.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-hex-muted line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
            ${
              inStock
                ? 'bg-hex-primary text-white hover:bg-orange-600 active:scale-95 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-hex-muted cursor-not-allowed'
            }`}
        >
          <ShoppingCart size={15} />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </Link>
  );
}
