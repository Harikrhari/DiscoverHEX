import { Link } from 'react-router-dom';
import { TrendingUp, Eye, Star, ArrowRight } from 'lucide-react';
import { sponsors } from '../data/mockData';

const tiers = [
  { name: 'Gold Sponsor', price: '$2,500/mo', color: '#F5A623', benefits: ['3 featured products', 'Homepage banner', '100K+ reach', 'Monthly ROI report', 'Social media mentions'] },
  { name: 'Silver Sponsor', price: '$1,200/mo', color: '#9B59B6', benefits: ['2 featured products', 'Category page banner', '60K+ reach', 'Bi-monthly ROI report'] },
  { name: 'Bronze Sponsor', price: '$500/mo', color: '#CD7F32', benefits: ['1 featured product', 'Marketplace listing badge', '25K+ reach', 'Quarterly ROI report'] },
];

export default function Sponsors() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hex-secondary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Star size={40} className="mx-auto text-hex-gold mb-4 fill-hex-gold" />
          <h1 className="text-4xl font-extrabold mb-4">Partner with DiscoverHEX</h1>
          <p className="text-lg text-gray-300 mb-8">
            Get your brand in front of 100,000+ health-conscious, high-purchasing shoppers.
            Sponsor products, earn visibility, and grow with us.
          </p>
          <div className="grid grid-cols-3 gap-6 bg-white/10 rounded-2xl p-6">
            <div><div className="text-2xl font-bold text-hex-gold">100K+</div><div className="text-sm text-gray-400">Monthly Reach</div></div>
            <div><div className="text-2xl font-bold text-hex-gold">4.8★</div><div className="text-sm text-gray-400">Avg. Product Rating</div></div>
            <div><div className="text-2xl font-bold text-hex-gold">12K+</div><div className="text-sm text-gray-400">Orders/Month</div></div>
          </div>
        </div>
      </section>

      {/* Current sponsors */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Current Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-hex-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-hex-secondary">{s.name}</h3>
                  <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                    s.tier === 'gold' ? 'bg-yellow-100 text-yellow-700'
                    : s.tier === 'silver' ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
                  }`}>{s.tier} sponsor</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-3">{s.description}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span><Eye size={12} className="inline mr-1" />{s.totalReach} reach</span>
                <span><Star size={12} className="inline mr-1 text-hex-gold" />{s.productsSponsored} products</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-2xl shadow-sm border-2 p-6 hover:shadow-md transition-all" style={{ borderColor: tier.color }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${tier.color}20` }}>
                  <TrendingUp size={24} style={{ color: tier.color }} />
                </div>
                <h3 className="font-bold text-lg text-hex-secondary mb-1">{tier.name}</h3>
                <p className="font-extrabold text-2xl mb-4" style={{ color: tier.color }}>{tier.price}</p>
                <ul className="space-y-2 mb-6">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowRight size={14} style={{ color: tier.color }} className="flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:sponsors@discoverhex.com"
                  className="block text-center text-white font-bold py-3 rounded-xl transition-colors hover:opacity-90"
                  style={{ backgroundColor: tier.color }}
                >
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why sponsor */}
      <section className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-hex-secondary mb-4">Why Sponsor DiscoverHEX?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-8">
          {[
            { icon: '🎯', title: 'Targeted Audience', desc: 'Health-conscious buyers aged 18–45 who spend $100–$500/mo on fitness and lifestyle products.' },
            { icon: '📊', title: 'Real ROI Data', desc: 'Track impressions, clicks, attributed sales, and return on investment via your sponsor dashboard.' },
            { icon: '💚', title: 'Give Back Together', desc: 'Your sponsorship also supports our charity campaigns — a CSR win for your brand.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-5">
              <span className="text-3xl">{icon}</span>
              <h3 className="font-bold text-hex-secondary mt-2 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
