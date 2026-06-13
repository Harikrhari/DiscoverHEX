import { Link } from 'react-router-dom';
import { Zap, Instagram, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-hex-secondary text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-hex-primary" size={22} />
              <span className="text-white font-bold text-lg">DiscoverHEX</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Discover the Best Version of Yourself. Premium products, real sponsors, transparent charity.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-hex-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-hex-primary transition-colors"><Youtube size={20} /></a>
              <a href="#" className="hover:text-hex-primary transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['Sports & Fitness', 'Health & Wellness', 'Outdoor & Adventure', 'Smart Gadgets', 'Premium Lifestyle'].map((c) => (
                <li key={c}>
                  <Link to="/marketplace" className="hover:text-hex-primary transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sponsors" className="hover:text-hex-primary transition-colors">Become a Sponsor</Link></li>
              <li><Link to="/creators" className="hover:text-hex-primary transition-colors">Creator Program</Link></li>
              <li><Link to="/invest" className="hover:text-hex-primary transition-colors">Invest in HEX</Link></li>
              <li><Link to="/charity" className="hover:text-hex-primary transition-colors">Our Charity</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Stay in the Loop</h4>
            <p className="text-sm text-gray-400 mb-3">Get launch deals, charity updates & creator features.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-hex-primary"
              />
              <button
                type="submit"
                className="bg-hex-primary hover:bg-orange-600 text-white text-sm font-bold px-3 py-2 rounded-lg transition-colors"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Charity strip */}
        <div className="border-t border-gray-700 pt-6 mb-4">
          <div className="bg-hex-green/10 border border-hex-green/30 rounded-lg p-3 text-center text-sm">
            💚 <strong className="text-hex-green">$43,300+ donated</strong> to verified causes since launch.{' '}
            <Link to="/charity" className="underline text-hex-green hover:text-green-400">See every transaction →</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© 2025 DiscoverHEX. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
