import { Instagram, Youtube, Check, ArrowRight } from 'lucide-react';
import { creators } from '../data/mockData';

const commissionTiers = [
  { followers: '1K – 10K', rate: '8%', label: 'Nano Creator', color: '#27AE60' },
  { followers: '10K – 100K', rate: '10%', label: 'Micro Creator', color: '#FF6B35' },
  { followers: '100K – 1M', rate: '12%', label: 'Macro Creator', color: '#9B59B6' },
  { followers: '1M+', rate: '15%', label: 'Mega Creator', color: '#F5A623' },
];

const steps = [
  { step: '1', title: 'Apply', desc: 'Fill out a quick form. Tell us your niche, audience size, and platform.' },
  { step: '2', title: 'Get Products', desc: 'We send you real products to try. No cost to you for approved creators.' },
  { step: '3', title: 'Post with HEX Tools', desc: 'Use our auto-caption generator and social posting tools. One click to post to IG, YT, and FB.' },
  { step: '4', title: 'Earn Commission', desc: 'Track clicks and sales in your creator dashboard. Get paid monthly via Stripe.' },
];

export default function Influencers() {
  return (
    <div>
      {/* Hero */}
      <section className="hex-gradient text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <Instagram size={36} />
            <Youtube size={36} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Turn Your Audience Into Income</h1>
          <p className="text-lg text-white/80 mb-8">
            Join 500+ creators earning real commissions promoting premium DiscoverHEX products.
            We handle the social tools — you just post and earn.
          </p>
          <a
            href="#apply"
            className="inline-block bg-white text-hex-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Apply to Creator Program
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-hex-secondary text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-12 h-12 bg-hex-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                {step}
              </div>
              <h3 className="font-bold text-hex-secondary mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Commission tiers */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Commission Rates</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {commissionTiers.map((t) => (
              <div key={t.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border-t-4" style={{ borderColor: t.color }}>
                <div className="text-3xl font-extrabold mb-1" style={{ color: t.color }}>{t.rate}</div>
                <div className="font-semibold text-hex-secondary text-sm mb-1">{t.label}</div>
                <div className="text-xs text-gray-400">{t.followers} followers</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            Commission rates apply to all attributed sales within 30 days of click. Paid monthly via Stripe.
          </p>
        </div>
      </section>

      {/* Auto-posting tools highlight */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-hex-secondary text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">🤖 Auto-Posting Tools Included</h2>
          <p className="text-gray-300 mb-6">
            DiscoverHEX gives you a full social media toolkit — no extra apps needed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { icon: <Instagram size={20} />, title: 'Instagram', desc: 'Auto-post product images with generated captions + hashtags' },
              { icon: <Youtube size={20} />, title: 'YouTube', desc: 'Push community posts and video descriptions with one click' },
              { icon: '📘', title: 'Facebook', desc: 'Auto-share to your page or group with targeted copy' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {typeof icon === 'string' ? <span className="text-xl">{icon}</span> : icon}
                  <span className="font-semibold">{title}</span>
                </div>
                <p className="text-sm text-gray-300">{desc}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {['Caption generator with brand voice', 'Hashtag optimizer for each platform', 'Performance tracking per post'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                <Check size={14} className="text-hex-green" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top creators */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-hex-secondary text-center mb-8">Meet Our Top Creators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {creators.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-hex-primary text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-2">
                  {c.avatar}
                </div>
                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-400">{c.handle}</p>
                <p className="text-xs text-gray-500 mt-1">{c.followers}</p>
                <p className="text-sm text-hex-green font-bold mt-1">{c.earnings}/mo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-hex-secondary mb-2">Apply to Creator Program</h2>
          <p className="text-sm text-gray-400 mb-6">Takes 2 minutes. We review in 48 hours.</p>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {[
              { name: 'name', label: 'Full Name', type: 'text' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'handle', label: 'Primary Social Handle (@...)', type: 'text' },
              { name: 'followers', label: 'Approximate Followers', type: 'number' },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hex-primary"
                  required
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Your Niche</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-hex-primary">
                <option>Sports & Fitness</option>
                <option>Health & Wellness</option>
                <option>Outdoor & Adventure</option>
                <option>AI & Smart Gadgets</option>
                <option>Premium Lifestyle</option>
                <option>Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-hex-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              Submit Application <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
