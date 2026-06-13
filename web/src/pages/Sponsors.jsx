import { useState } from 'react';
import { Star, TrendingUp, Award, Users, CheckCircle, Zap } from 'lucide-react';
import { sponsors } from '../data/mockData';

const TIER_CONFIG = {
  gold: {
    label: 'Gold Partner',
    color: '#F5A623',
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-500/40',
    badgeBg: '#F5A623',
    badgeText: '#000',
  },
  silver: {
    label: 'Silver Partner',
    color: '#9CA3AF',
    bg: 'bg-gray-700/20',
    border: 'border-gray-500/40',
    badgeBg: '#9CA3AF',
    badgeText: '#000',
  },
  bronze: {
    label: 'Bronze Partner',
    color: '#CD7F32',
    bg: 'bg-orange-900/20',
    border: 'border-orange-700/40',
    badgeBg: '#CD7F32',
    badgeText: '#fff',
  },
};

function SponsorLogo({ sponsor }) {
  const [imgError, setImgError] = useState(false);
  const cfg = TIER_CONFIG[sponsor.tier] || TIER_CONFIG.bronze;
  if (imgError) {
    return (
      <div
        className="w-full h-16 rounded-lg flex items-center justify-center text-2xl font-black text-white"
        style={{ backgroundColor: cfg.color }}
      >
        {sponsor.name.charAt(0)}
      </div>
    );
  }
  return (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      className="w-full h-16 object-contain rounded-lg p-2"
      style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      onError={() => setImgError(true)}
    />
  );
}

function SponsorCard({ sponsor, size }) {
  const cfg = TIER_CONFIG[sponsor.tier] || TIER_CONFIG.bronze;
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${cfg.bg} ${cfg.border}`}
    >
      <div className={size === 'large' ? 'w-48 mx-auto' : 'w-28'}>
        <SponsorLogo sponsor={sponsor} />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <h3
          className={`font-black text-white ${size === 'large' ? 'text-2xl' : 'text-lg'}`}
        >
          {sponsor.name}
        </h3>
        <span
          className="text-xs font-bold px-3 py-0.5 rounded-full"
          style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
        >
          {cfg.label}
        </span>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{sponsor.description}</p>
      <div className="flex gap-6 mt-auto pt-3 border-t border-white/10">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Products</p>
          <p className="font-black text-white text-lg">{sponsor.productsSponsored}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Total Reach</p>
          <p className="font-black text-lg" style={{ color: cfg.color }}>{sponsor.totalReach}</p>
        </div>
      </div>
    </div>
  );
}

const TABLE_FEATURES = [
  'Homepage Placement',
  'Dedicated Sponsor Page',
  'Product Placement',
  'Analytics Dashboard',
  'Charity Co-Branding',
  'Dedicated Account Manager',
];

const TABLE_TIERS = [
  {
    name: 'Gold',
    price: '$5,000',
    color: '#F5A623',
    has: [true, true, true, true, true, true],
  },
  {
    name: 'Silver',
    price: '$2,500',
    color: '#9CA3AF',
    has: [true, false, true, true, true, false],
  },
  {
    name: 'Bronze',
    price: '$1,000',
    color: '#CD7F32',
    has: [false, false, true, false, false, false],
  },
];

function TiersTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm min-w-[540px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left p-4 text-gray-400 font-medium w-48">Feature</th>
            {TABLE_TIERS.map((t) => (
              <th key={t.name} className="p-4 text-center">
                <div className="font-black text-white text-base">{t.name}</div>
                <div className="font-black text-lg mt-1" style={{ color: t.color }}>
                  {t.price}
                  <span className="text-xs text-gray-400 font-normal">/mo</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_FEATURES.map((feat, i) => (
            <tr key={feat} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 text-gray-300">{feat}</td>
              {TABLE_TIERS.map((t) => (
                <td key={t.name} className="p-4 text-center">
                  {t.has[i] ? (
                    <CheckCircle className="inline-block text-green-400" size={18} />
                  ) : (
                    <span className="text-gray-600 text-lg">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BENEFITS = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Massive Reach',
    desc: 'Access 125K+ engaged shoppers and followers across social platforms.',
  },
  {
    icon: <Award size={20} />,
    title: 'Charity Co-Branding',
    desc: 'Align your brand with causes that matter — education, health, and youth sports.',
  },
  {
    icon: <Star size={20} />,
    title: 'Product Placement',
    desc: 'Feature your products prominently in the HEX marketplace and creator content.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Analytics & ROI',
    desc: 'Real-time dashboard showing clicks, conversions, and campaign performance.',
  },
];

export default function Sponsors() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    tier: 'gold',
    message: '',
  });
  const [toast, setToast] = useState('');

  const goldSponsors = sponsors.filter((s) => s.tier === 'gold');
  const silverSponsors = sponsors.filter((s) => s.tier === 'silver');
  const bronzeSponsors = sponsors.filter((s) => s.tier === 'bronze');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    showToast("Thanks! We'll reach out within 24 hours to discuss your sponsorship.");
    setForm({ name: '', company: '', email: '', tier: 'gold', message: '' });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F1A' }}>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl text-white font-semibold max-w-sm"
          style={{ backgroundColor: '#27AE60' }}
        >
          {toast}
        </div>
      )}

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: '#F5A623' }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: '#FF6B35' }}
          />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
            style={{ backgroundColor: 'rgba(245,166,35,0.12)', borderColor: 'rgba(245,166,35,0.3)', color: '#F5A623' }}
          >
            <Star size={14} />
            Sponsor Program
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Power the{' '}
            <span style={{ color: '#F5A623' }}>Movement</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Partner with DiscoverHEX and reach a passionate community of athletes, outdoor
            enthusiasts, and wellness seekers — while supporting real charitable causes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: '5', label: 'Active Sponsors' },
              { value: '$500K+', label: 'in Support' },
              { value: '125,000', label: 'Combined Reach' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl p-6 border border-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="text-4xl font-black mb-1" style={{ color: '#F5A623' }}>
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Current Sponsors ─────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Our Sponsors</h2>
          <p className="text-gray-400 text-center mb-14">The brands powering the HEX ecosystem</p>

          {/* Gold */}
          {goldSponsors.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <Award size={20} style={{ color: '#F5A623' }} />
                <h3 className="text-xl font-bold" style={{ color: '#F5A623' }}>Gold Partners</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goldSponsors.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} size="large" />
                ))}
              </div>
            </div>
          )}

          {/* Silver */}
          {silverSponsors.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <Award size={20} style={{ color: '#9CA3AF' }} />
                <h3 className="text-xl font-bold" style={{ color: '#9CA3AF' }}>Silver Partners</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {silverSponsors.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} size="medium" />
                ))}
              </div>
            </div>
          )}

          {/* Bronze */}
          {bronzeSponsors.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-5">
                <Award size={20} style={{ color: '#CD7F32' }} />
                <h3 className="text-xl font-bold" style={{ color: '#CD7F32' }}>Bronze Partners</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bronzeSponsors.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} size="small" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Become a Sponsor ─────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-4">Become a Sponsor</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Join our growing network of purpose-driven brands and connect with an audience
              that genuinely cares.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-6 border border-white/10 flex flex-col gap-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
                >
                  {b.icon}
                </div>
                <h4 className="text-white font-bold">{b.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Tiers table */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-white text-center mb-8">Sponsorship Tiers</h3>
            <TiersTable />
          </div>

          {/* Contact form */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white text-center mb-8">Get in Touch</h3>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 p-8 flex flex-col gap-5"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    placeholder="Acme Corp"
                    className="w-full rounded-xl border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@company.com"
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Interested Tier</label>
                <select
                  name="tier"
                  value={form.tier}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                  style={{ backgroundColor: '#111827' }}
                >
                  <option value="gold">Gold — $5,000/mo</option>
                  <option value="silver">Silver — $2,500/mo</option>
                  <option value="bronze">Bronze — $1,000/mo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your brand and goals..."
                  className="w-full rounded-xl border border-white/10 px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:opacity-90 active:scale-[.98]"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Submit Sponsorship Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Partner Logo Strip ───────────────────────────── */}
      <section className="py-14 px-4 border-t border-white/5" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-xs mb-8 uppercase tracking-widest">Trusted by</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {sponsors.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <Users size={14} className="mr-2 text-gray-500" />
                <span className="text-gray-300 font-semibold text-sm">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
