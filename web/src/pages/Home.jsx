import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import ProductCard from '../components/marketplace/ProductCard';
import CharityCounter from '../components/charity/CharityCounter';
import { products, categories, sponsors, creators } from '../data/mockData';

export default function Home() {
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="hex-gradient text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            🚀 Public Investment Round Opening Soon — <Link to="/invest" className="underline">Join Waitlist</Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover the Best<br />
            <span className="text-yellow-300">Version of Yourself</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Premium products. Real sponsors. Transparent charity. One marketplace built for human excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="bg-white text-hex-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/charity"
              className="bg-hex-green/80 hover:bg-hex-green text-white font-bold px-8 py-4 rounded-xl transition-colors"
            >
              💚 See Our Charity Impact
            </Link>
          </div>
          <div className="flex justify-center gap-8 mt-10 text-sm text-white/70">
            <div><span className="text-white font-bold text-xl">12K+</span><br />Products Sold</div>
            <div><span className="text-white font-bold text-xl">$43K+</span><br />Donated to Charity</div>
            <div><span className="text-white font-bold text-xl">500+</span><br />Creators Earning</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-hex-secondary mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 hover:border-hex-primary hover:shadow-md transition-all group"
                style={{ borderColor: `${cat.color}30` }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold text-center text-gray-700 group-hover:text-hex-primary transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-hex-secondary">Featured Products</h2>
              <p className="text-sm text-gray-500 mt-1">Top-rated items our community loves</p>
            </div>
            <Link to="/marketplace" className="text-hex-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-hex-gold/10 text-hex-gold text-xs font-bold px-3 py-1 rounded-full mb-3">
              PREMIUM PARTNERS
            </span>
            <h2 className="text-2xl font-bold text-hex-secondary">Our Sponsors</h2>
            <p className="text-sm text-gray-500 mt-1">Trusted brands backing our products</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.map((s) => (
              <div key={s.id} className="flex items-center gap-3 bg-gray-50 border rounded-xl px-5 py-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-hex-secondary flex items-center justify-center text-white font-bold text-sm">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.totalReach} reach</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/sponsors" className="text-hex-primary font-semibold text-sm hover:underline">
              Become a Sponsor → Reach 100K+ shoppers
            </Link>
          </div>
        </div>
      </section>

      {/* Charity Counter */}
      <CharityCounter />

      {/* Creators */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-hex-primary/10 text-hex-primary text-xs font-bold px-3 py-1 rounded-full mb-3">
              CREATOR PROGRAM
            </span>
            <h2 className="text-2xl font-bold text-hex-secondary">Join 500+ Creators Earning with HEX</h2>
            <p className="text-sm text-gray-500 mt-1">Post, promote, and earn commission on every sale</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {creators.map((c) => (
              <div key={c.id} className="text-center bg-gray-50 rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-hex-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                  {c.avatar}
                </div>
                <p className="text-xs font-semibold text-gray-900 truncate">{c.name}</p>
                <p className="text-xs text-gray-400">{c.followers} followers</p>
                <p className="text-xs text-hex-green font-semibold mt-1">{c.earnings}/mo</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/creators"
              className="inline-block bg-hex-primary hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Apply to Creator Program
            </Link>
          </div>
        </div>
      </section>

      {/* Crowdfunding CTA */}
      <section className="py-12 px-4 bg-hex-secondary text-white">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp size={40} className="mx-auto text-hex-gold mb-4" />
          <h2 className="text-3xl font-bold mb-4">Own a Piece of DiscoverHEX</h2>
          <p className="text-gray-300 mb-6 text-lg">
            We're opening a public investment round. Be an early investor and grow with us.
            Starting at just $100.
          </p>
          <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
            <div className="flex justify-center gap-8 text-center">
              <div><div className="text-2xl font-bold text-hex-gold">$500K</div><div className="text-sm text-gray-300">Target Raise</div></div>
              <div><div className="text-2xl font-bold text-hex-gold">$100</div><div className="text-sm text-gray-300">Min. Investment</div></div>
              <div><div className="text-2xl font-bold text-hex-gold">3 Tiers</div><div className="text-sm text-gray-300">Investor Levels</div></div>
            </div>
          </div>
          <Link
            to="/invest"
            className="inline-block bg-hex-gold hover:bg-yellow-500 text-hex-secondary font-bold px-10 py-4 rounded-xl transition-colors text-lg"
          >
            Learn More & Reserve Your Spot
          </Link>
        </div>
      </section>
    </div>
  );
}
