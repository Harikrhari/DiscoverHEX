import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Filter, ShoppingCart, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import { products, categories } from '../data/mockData';
import ProductCard from '../components/marketplace/ProductCard';

// ── Constants ─────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

// ── Filter Panel (shared between sidebar and mobile modal) ───────────────────

function FilterPanel({ selectedCategory, onCategoryChange, sortBy, onSortChange, priceRange, onPriceChange, onClear }) {
  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-hex-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-hex-primary'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-hex-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-hex-primary'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Sort By
        </h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="sort"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => onSortChange(opt.value)}
                className="accent-hex-primary w-3.5 h-3.5 flex-shrink-0"
              />
              <span
                className={`text-sm transition-colors ${
                  sortBy === opt.value
                    ? 'font-semibold text-hex-primary'
                    : 'text-gray-600'
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Max Price
        </h3>
        <div className="px-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">$0</span>
            <span className="text-sm font-bold text-hex-primary">${priceRange}</span>
            <span className="text-xs text-gray-500">$300</span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={5}
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none accent-hex-primary cursor-pointer"
          />
        </div>
      </div>

      {/* Clear button */}
      <button
        onClick={onClear}
        className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:border-hex-accent hover:text-hex-accent transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(300);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Store
  const addToCart = useStore((s) => s.addToCart);
  const cartCount = useStore((s) => s.cartCount());
  const openCart = useStore((s) => s.openCart);

  // Handle category change — also sync to URL params
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
    setPriceRange(300);
    setSearchParams({});
  };

  // Derived: filtered + sorted products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Search filter — match name, tags, description
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Price filter
    list = list.filter((p) => p.price <= priceRange);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Reverse original index as proxy for "newest"
        list.reverse();
        break;
      case 'popular':
      default:
        list.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, priceRange]);

  const activeFilterCount = [
    selectedCategory !== 'all',
    sortBy !== 'popular',
    priceRange < 300,
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="bg-hex-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Marketplace</h1>
          <p className="text-gray-300 text-sm sm:text-base">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} —
            every purchase funds a cause
          </p>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products, tags, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-hex-primary focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-hex-primary hover:text-hex-primary transition-colors relative"
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-hex-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Result count — desktop only */}
          <span className="hidden md:block text-sm text-gray-400 ml-auto flex-shrink-0">
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar filter panel (desktop) ─────────────────────────────── */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-32">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-hex-primary" />
                  <span className="text-sm font-bold text-hex-secondary">Filters</span>
                </div>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold bg-hex-accent text-white px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          {/* ── Product grid ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Active filter chips */}
            {(selectedCategory !== 'all' || sortBy !== 'popular' || priceRange < 300) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 bg-hex-primary/10 text-hex-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                    {categories.find((c) => c.id === selectedCategory)?.icon}{' '}
                    {categories.find((c) => c.id === selectedCategory)?.label}
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className="ml-0.5 hover:text-hex-accent transition-colors"
                      aria-label="Remove category filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {sortBy !== 'popular' && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <button
                      onClick={() => setSortBy('popular')}
                      className="ml-0.5 hover:text-hex-accent transition-colors"
                      aria-label="Remove sort filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {priceRange < 300 && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Up to ${priceRange}
                    <button
                      onClick={() => setPriceRange(300)}
                      className="ml-0.5 hover:text-hex-accent transition-colors"
                      aria-label="Remove price filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* No results state */}
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-hex-secondary mb-2">No products found</h3>
                <p className="text-gray-400 text-sm max-w-xs mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 bg-hex-primary hover:bg-orange-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
                >
                  <X size={15} />
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Mobile result count */}
                <p className="md:hidden text-xs text-gray-400 mb-4">
                  {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                </p>

                {/* Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>

                {/* Charity reminder footer */}
                <div className="mt-10 bg-hex-green/5 border border-hex-green/20 rounded-2xl p-5 flex items-center gap-4">
                  <Heart size={22} className="text-hex-green flex-shrink-0" fill="currentColor" />
                  <div>
                    <p className="text-sm font-bold text-hex-secondary">
                      Every purchase makes a difference
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      5–10% of every sale goes directly to our active charity campaigns.{' '}
                      <Link to="/charity" className="text-hex-green hover:underline font-medium">
                        See the impact →
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile floating cart button ───────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 bg-hex-primary hover:bg-orange-600 text-white font-bold px-5 py-3.5 rounded-full shadow-xl transition-all duration-200 active:scale-95"
          aria-label="Open cart"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <>
              <span className="text-sm">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-hex-accent rounded-full text-[11px] font-extrabold flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </>
          )}
          {cartCount === 0 && <span className="text-sm">Cart</span>}
        </button>
      </div>

      {/* ── Mobile filter modal ───────────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer sliding from bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Handle + header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 pt-4 pb-3 z-10">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-hex-primary" />
                  <span className="font-bold text-hex-secondary">Filters & Sort</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[10px] font-bold bg-hex-accent text-white px-2 py-0.5 rounded-full">
                      {activeFilterCount} active
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                  aria-label="Close filters"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filter content */}
            <div className="px-5 py-5">
              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                sortBy={sortBy}
                onSortChange={(v) => { setSortBy(v); }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onClear={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
              />
            </div>

            {/* Apply button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-hex-primary hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
              >
                Show {filteredProducts.length} Result{filteredProducts.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
