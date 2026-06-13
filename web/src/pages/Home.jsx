import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Users,
  ShoppingBag,
  Zap,
  Star,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import useStore from '../store/useStore';
import {
  products,
  categories,
  sponsors,
  charityCampaigns,
  charityStats,
} from '../data/mockData';
import ProductCard from '../components/marketplace/ProductCard';

const featuredProducts = products.slice(0, 4);

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBadge({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4">
      <span className="text-2xl sm:text-3xl font-extrabold text-hex-primary">{value}</span>
      <span className="text-xs sm:text-sm text-gray-300 font-medium text-center">{label}</span>
    </div>
  );
}

function CategoryCard({ category }) {
  return (
    <Link
      to={`/marketplace?category=${category.id}`}
      className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      style={{ borderColor: `${category.color}40` }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: `${category.color}18` }}
      >
        {category.icon}
      </div>
      <span className="text-sm font-semibold text-hex-secondary text-center leading-tight group-hover:text-hex-primary transition-colors">
        {category.label}
      </span>
      <ChevronRight
        size={14}
        className="text-gray-400 group-hover:text-hex-primary transition-colors"
      />
    </Link>
  );
}

function CharityProgressBar({ raised, goal, color }) {
  const percent = Math.min(Math.round((raised / goal) * 100), 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="font-semibold" style={{ color }}>
          {percent}% funded
        </span>
        <span>Goal: ${goal.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function CharityCampaignCard({ campaign }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="h-1.5" style={{ backgroundColor: campaign.color }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
            style={{ backgroundColor: `${campaign.color}18` }}
          >
            {campaign.icon}
          </div>
          <div>
            <h3 className="font-bold text-hex-secondary text-base leading-tight group-hover:text-hex-primary transition-colors">
              {campaign.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{campaign.location}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {campaign.description}
        </p>
        <CharityProgressBar
          raised={campaign.raised}
          goal={campaign.goal}
          color={campaign.color}
        />
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Heart size={13} className="text-hex-green" fill="currentColor" />
            <span className="text-xs font-semibold text-hex-green">
              ${campaign.raised.toLocaleString()} raised
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              {campaign.beneficiaries} beneficiaries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SponsorChip({ sponsor }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow">
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="h-7 object-contain"
        loading="lazy"
      />
      <div>
        <p className="text-xs font-bold text-hex-secondary leading-tight">{sponsor.name}</p>
        <p className="text-[10px] text-gray-400 capitalize">{sponsor.tier} partner</p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const addToCart = useStore((s) => s.addToCart);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-hex-secondary overflow-hidden">
        {/* Ambient glow decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-hex-primary opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-hex-accent opacity-10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-hex-primary opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 bg-hex-primary/20 border border-hex-primary/30 text-hex-primary text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Zap size={12} />
            <span>Where Excellence Meets Impact</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Discover Human{' '}
            <span className="text-hex-primary">Excellence</span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed mb-10">
            Shop premium products from elite creators — and with every purchase, a percentage
            goes directly to causes that change lives. Real impact. Real products. Real people.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-hex-primary hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag size={18} />
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/creators"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Star size={18} />
              Join as Creator
            </Link>
          </div>

          {/* Animated stats row */}
          <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
              <StatBadge value="$43,300+" label="Donated to Charity" />
              <StatBadge value="12,000+" label="Products Listed" />
              <StatBadge value="6,000+" label="Active Creators" />
              <StatBadge value="4" label="Active Causes" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Category Grid ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-hex-secondary mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-sm">Every category. Every cause. One platform.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Products ─────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-hex-secondary mb-1">
                Featured Products
              </h2>
              <p className="text-gray-500 text-sm">Handpicked by our community of creators</p>
            </div>
            <Link
              to="/marketplace"
              className="hidden sm:inline-flex items-center gap-1.5 text-hex-primary hover:text-orange-600 font-semibold text-sm transition-colors"
            >
              View All Products
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          {/* Mobile "View All" link */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-hex-primary hover:text-orange-600 font-semibold text-sm transition-colors"
            >
              View All Products
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Charity Impact ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-hex-green/10 text-hex-green text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest">
                <Heart size={11} fill="currentColor" />
                Real Impact
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-hex-secondary mb-1">
                Where Your Money Goes
              </h2>
              <p className="text-gray-500 text-sm">
                Every purchase funds one of these active campaigns
              </p>
            </div>
            <Link
              to="/charity"
              className="hidden sm:inline-flex items-center gap-1.5 text-hex-green hover:text-green-700 font-semibold text-sm transition-colors"
            >
              See Full Impact
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {charityCampaigns.map((campaign) => (
              <CharityCampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/charity"
              className="inline-flex items-center gap-2 text-hex-green hover:text-green-700 font-semibold text-sm transition-colors"
            >
              See Full Impact
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Sponsors Strip ────────────────────────────────────────────────── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Trusted Sponsors
            </p>
            <Link
              to="/sponsors"
              className="text-xs font-semibold text-hex-primary hover:text-orange-600 transition-colors"
            >
              View all sponsors →
            </Link>
          </div>
          {/* Horizontally scrollable strip */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {sponsors.map((sponsor) => (
              <SponsorChip key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Creator CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-hex-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-hex-primary opacity-10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-hex-accent opacity-10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-hex-primary/20 border border-hex-primary/30 text-hex-primary text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <TrendingUp size={12} />
            For Creators
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            Turn Your Influence Into{' '}
            <span className="text-hex-primary">Income &amp; Impact</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join 6,000+ creators earning commissions, building audiences, and making a real
            difference. List products, grow your brand, and donate to the causes you care about.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/creators"
              className="inline-flex items-center gap-2 bg-hex-primary hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Join as Creator
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Stats Section ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-hex-secondary mb-2">
              The Numbers Don't Lie
            </h2>
            <p className="text-gray-500 text-sm">
              Every stat below represents a life touched through your purchase
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Donated */}
            <div className="bg-gradient-to-br from-hex-primary/5 to-hex-primary/10 border border-hex-primary/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-extrabold text-hex-primary mb-2">
                ${charityStats.totalDonated.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Total Donated
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Heart size={12} className="text-hex-primary" fill="currentColor" />
                <span className="text-[11px] text-gray-400">and counting</span>
              </div>
            </div>

            {/* Orders with donation */}
            <div className="bg-gradient-to-br from-hex-green/5 to-hex-green/10 border border-hex-green/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-extrabold text-hex-green mb-2">
                {charityStats.ordersWithDonation.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Orders with Donation
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <ShoppingBag size={12} className="text-hex-green" />
                <span className="text-[11px] text-gray-400">impact purchases</span>
              </div>
            </div>

            {/* Beneficiaries */}
            <div className="bg-gradient-to-br from-hex-accent/5 to-hex-accent/10 border border-hex-accent/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-extrabold text-hex-accent mb-2">
                {charityStats.beneficiaries.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Lives Impacted
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Users size={12} className="text-hex-accent" />
                <span className="text-[11px] text-gray-400">beneficiaries</span>
              </div>
            </div>

            {/* Active campaigns */}
            <div className="bg-gradient-to-br from-hex-gold/5 to-hex-gold/10 border border-hex-gold/20 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-extrabold text-hex-gold mb-2">
                {charityStats.activeCampaigns}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600">
                Active Campaigns
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-hex-gold" />
                <span className="text-[11px] text-gray-400">running now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
