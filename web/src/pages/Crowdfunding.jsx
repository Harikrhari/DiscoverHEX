import { TrendingUp, Check, Users, DollarSign } from 'lucide-react';

const tiers = [
  {
    name: 'Community Investor',
    price: '$100',
    icon: '🌱',
    color: '#27AE60',
    perks: [
      'DiscoverHEX Early Investor badge',
      '10% lifetime discount on all purchases',
      'Quarterly investor update emails',
      'Listed in our "Community Backers" page',
    ],
  },
  {
    name: 'Growth Partner',
    price: '$1,000',
    icon: '🚀',
    color: '#FF6B35',
    perks: [
      'Everything in Community Investor',
      '1% equity stake (limited slots)',
      '20% lifetime discount',
      'Invite to private investor calls',
      'Vote on new product categories',
    ],
    featured: true,
  },
  {
    name: 'Strategic Investor',
    price: '$10,000',
    icon: '💎',
    color: '#F5A623',
    perks: [
      'Everything in Growth Partner',
      '5% equity stake (5 slots only)',
      '30% lifetime discount + free products',
      'Board advisory seat',
      'Co-branded sponsor opportunity',
      'Revenue sharing on milestone profits',
    ],
  },
];

const faqs = [
  { q: 'Is this a regulated security offering?', a: 'We are preparing a Regulation Crowdfunding (Reg CF) offering. Investments will only be accepted once all SEC filings are complete. The waitlist is non-binding.' },
  { q: 'When does the round open?', a: 'We expect to open the formal investment round in Q3 2025 following our MVP launch. Waitlist members get 72-hour early access.' },
  { q: 'What are projected returns?', a: 'Projections (not guarantees): Year 3 scenarios range from 3.3x (conservative) to 16x (optimistic). See our Investor Pitch for full financial modeling.' },
  { q: 'Can I invest as an international backer?', a: 'Initially US residents only for Reg CF. We plan to open international rounds via Reg S in Phase 2.' },
];

export default function Crowdfunding() {
  const raised = 87400;
  const goal = 500000;
  const pct = Math.round((raised / goal) * 100);

  return (
    <div>
      {/* Hero */}
      <section className="bg-hex-secondary text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingUp size={48} className="mx-auto text-hex-gold mb-4" />
          <h1 className="text-4xl font-extrabold mb-4">Own a Piece of DiscoverHEX</h1>
          <p className="text-lg text-gray-300 mb-8">
            We're opening a public investment round for our community. Be an early backer, grow with us, and help us change how the world shops for excellence.
          </p>
          {/* Progress */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-hex-gold">${raised.toLocaleString()} raised</span>
              <span className="text-gray-400">${goal.toLocaleString()} goal</span>
            </div>
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-hex-gold rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{pct}% funded</span>
              <span>Round closes when full</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Choose Your Investment Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-2xl shadow-sm border-2 p-6 relative ${tier.featured ? 'shadow-lg' : ''}`}
              style={{ borderColor: tier.featured ? tier.color : '#e5e7eb' }}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-hex-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <div className="text-4xl mb-3">{tier.icon}</div>
              <h3 className="font-bold text-xl text-hex-secondary mb-1">{tier.name}</h3>
              <p className="font-extrabold text-3xl mb-4" style={{ color: tier.color }}>{tier.price}</p>
              <ul className="space-y-2 mb-6">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={14} className="mt-0.5 flex-shrink-0 text-hex-green" />
                    {p}
                  </li>
                ))}
              </ul>
              <button
                className="w-full font-bold py-3 rounded-xl text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: tier.color }}
              >
                Reserve My Spot
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          * Reservation is non-binding. Formal investment documents issued upon round opening (pending SEC filing).
        </p>
      </section>

      {/* Why invest */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Why Invest in DiscoverHEX?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <DollarSign size={22} className="text-hex-gold" />, title: '$1T+ Addressable Market', desc: 'US ecommerce + influencer marketing + charitable giving combined.' },
              { icon: <Users size={22} className="text-hex-primary" />, title: 'Community-Driven Flywheel', desc: 'Investors become customers become ambassadors — built-in viral growth engine.' },
              { icon: <TrendingUp size={22} className="text-hex-green" />, title: '5 Revenue Streams', desc: 'Product sales, sponsor margins, creator commissions, charity match grants, and investment returns.' },
              { icon: <span className="text-xl">💚</span>, title: 'Charity = Moat', desc: 'The transparency charity model is a lasting differentiator no pure-profit competitor can easily copy.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div>
                  <h3 className="font-bold text-hex-secondary mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl p-5 shadow-sm border">
              <h3 className="font-semibold text-hex-secondary mb-2">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
