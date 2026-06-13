import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/marketplace/ProductCard';
import { products, categories } from '../data/mockData';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sponsoredOnly, setSponsoredOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || 'all';

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    if (sponsoredOnly) list = list.filter((p) => p.sponsored);
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case 'price-low': return list.sort((a, b) => a.price - b.price);
      case 'price-high': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [activeCategory, sort, maxPrice, sponsoredOnly]);

  const setCategory = (cat) => {
    if (cat === 'all') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-hex-secondary">Marketplace</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} products — every purchase funds a cause 💚
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-hex-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? 'bg-hex-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-6 sticky top-24">
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Sort By</h3>
              {sortOptions.map((o) => (
                <label key={o.value} className="flex items-center gap-2 text-sm text-gray-600 py-1 cursor-pointer hover:text-hex-primary">
                  <input
                    type="radio"
                    name="sort"
                    value={o.value}
                    checked={sort === o.value}
                    onChange={() => setSort(o.value)}
                    className="accent-hex-primary"
                  />
                  {o.label}
                </label>
              ))}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900 mb-3">Max Price: ${maxPrice}</h3>
              <input
                type="range"
                min={10}
                max={300}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-hex-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$10</span><span>$300</span>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sponsoredOnly}
                  onChange={(e) => setSponsoredOnly(e.target.checked)}
                  className="accent-hex-gold"
                />
                <span>★ Sponsored only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="text-sm text-gray-500">{filtered.length} results</span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-sm font-medium text-hex-primary"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
