import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Users,
  MapPin,
  TrendingUp,
  ShoppingBag,
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { charityCampaigns, charityStats } from '../data/mockData';
import CharityCounter from '../components/charity/CharityCounter';

// ── Animated progress bar ─────────────────────────────────────────────────────
function AnimatedProgressBar({ percent, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(Math.min(percent, 100)), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [percent, delay]);

  return (
    <div ref={ref} className="h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ── FAQ item ──────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-hex-secondary text-sm md:text-base">{question}</span>
        {open ? (
          <ChevronUp size={18} className="text-hex-primary flex-shrink-0 ml-3" />
        ) : (
          <ChevronDown size={18} className="text-gray-400 flex-shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

const FAQ_ITEMS = [
  {
    question: 'How is the charity percentage calculated on each purchase?',
    answer:
      'Each product on DiscoverHEX has a designated charity percentage (between 5% and 10%) set by our team in partnership with the brand. When you complete a purchase, that percentage of the product sale price is automatically earmarked and transferred to the associated campaign fund — no action needed on your part.',
  },
  {
    question: 'Are the charities on DiscoverHEX verified and legitimate?',
    answer:
      'Yes. Every charity partner we work with goes through a thorough vetting process that includes verification of their 501(c)(3) status (or international equivalent), financial auditing, and regular impact reporting. We publish fund allocation reports quarterly so you can see exactly how money is being used.',
  },
  {
    question: 'Can I choose which campaign my donation goes to?',
    answer:
      'Donations are tied to the specific product you purchase — each product supports a particular cause listed on its product page. In the future, we plan to introduce a "Choose Your Cause" feature that will let you redirect your donation to any active campaign at checkout.',
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Charity() {
  // Flatten all stories from all campaigns
  const allStories = charityCampaigns.flatMap((c) =>
    (c.stories || []).map((story) => ({ ...story, campaignTitle: c.title, campaignColor: c.color, campaignIcon: c.icon }))
  );

  return (
    <div className="bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-hex-secondary via-[#16213E] to-[#0F3460] text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hex-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-hex-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-hex-green/20 text-hex-green text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-hex-green/30">
            <Heart size={13} fill="currentColor" />
            Transparency Report — Live Data
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Every Purchase{' '}
            <span className="text-hex-green">Creates Impact</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-14">
            5–10% of every DiscoverHEX order goes directly to verified causes. No guessing, no
            middlemen — just full, auditable transparency on where your money goes.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8">
            <CharityCounter
              value={charityStats.totalDonated}
              label="Total Donated"
              prefix="$"
            />
            <CharityCounter
              value={charityStats.ordersWithDonation}
              label="Orders With Donation"
            />
            <CharityCounter
              value={charityStats.beneficiaries}
              label="Lives Impacted"
              suffix="+"
            />
            <CharityCounter
              value={charityStats.activeCampaigns}
              label="Active Campaigns"
            />
          </div>
        </div>
      </section>

      {/* ── Campaign cards ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-hex-secondary mb-3">Active Campaigns</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            These are the causes your purchases are currently funding. Progress bars update as
            donations roll in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {charityCampaigns.map((campaign, idx) => {
            const percent = Math.round((campaign.raised / campaign.goal) * 100);
            return (
              <div
                key={campaign.id}
                className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Color top bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: campaign.color }}
                />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: campaign.color + '20' }}
                    >
                      {campaign.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-hex-secondary text-lg leading-tight">
                        {campaign.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Users size={11} />
                          {campaign.beneficiaries} beneficiaries
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} />
                          {campaign.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {campaign.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-extrabold" style={{ color: campaign.color }}>
                        ${campaign.raised.toLocaleString()} raised
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {percent}% of ${campaign.goal.toLocaleString()} goal
                      </span>
                    </div>
                    <AnimatedProgressBar
                      percent={percent}
                      color={campaign.color}
                      delay={idx * 150}
                    />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[11px] text-gray-400">
                        ${(campaign.goal - campaign.raised).toLocaleString()} to go
                      </span>
                      <span className="text-[11px] font-semibold" style={{ color: campaign.color }}>
                        {percent}% funded
                      </span>
                    </div>
                  </div>

                  {/* Impact stories */}
                  {campaign.stories && campaign.stories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Impact Stories
                      </p>
                      {campaign.stories.map((story, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl p-3.5 border border-gray-100"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-gray-800 text-sm">{story.name}</p>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 flex-shrink-0">
                              <MapPin size={10} />
                              {story.location}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1">{story.impact}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-hex-secondary mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Supporting good causes has never been easier. No extra steps, no extra cost to you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connector lines (desktop) */}
            <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-hex-green via-hex-primary to-hex-accent" />

            {[
              {
                step: '1',
                icon: <ShoppingBag size={28} className="text-white" />,
                label: 'Shop Products',
                desc: 'Browse thousands of curated products across sports, health, outdoor, gadgets and lifestyle.',
                color: 'bg-hex-green',
              },
              {
                step: '2',
                icon: <TrendingUp size={28} className="text-white" />,
                label: 'We Donate X%',
                desc: '5–10% of your purchase is automatically allocated to the cause associated with that product.',
                color: 'bg-hex-primary',
              },
              {
                step: '3',
                icon: <BarChart2 size={28} className="text-white" />,
                label: 'Track Impact Live',
                desc: 'Watch campaign progress bars update in real time and read verified impact stories from beneficiaries.',
                color: 'bg-hex-accent',
              },
            ].map(({ step, icon, label, desc, color }, i) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div
                  className={`relative z-10 w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg mb-4`}
                >
                  {icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-hex-secondary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {step}
                  </span>
                </div>
                <h3 className="font-extrabold text-hex-secondary text-lg mb-2">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All impact stories ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-hex-secondary mb-3">Impact Stories</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real people. Real change. Every story below was made possible by DiscoverHEX shoppers
            like you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              {/* Campaign tag */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{story.campaignIcon}</span>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: story.campaignColor }}
                >
                  {story.campaignTitle}
                </span>
              </div>

              {/* Story content */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
                  style={{ backgroundColor: story.campaignColor }}
                >
                  {story.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-hex-secondary text-sm">{story.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                    <MapPin size={10} />
                    {story.location}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed italic">
                &ldquo;{story.impact}&rdquo;
              </p>

              <div
                className="mt-4 flex items-center gap-1 text-xs font-semibold"
                style={{ color: story.campaignColor }}
              >
                <CheckCircle size={12} />
                Verified Impact
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-hex-secondary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">
              Everything you want to know about how our charity model works.
            </p>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <FaqItem key={idx} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-hex-green to-emerald-600 py-16 px-4 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="text-5xl mb-4">💚</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            Make Your Next Purchase Count
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Every order you place directly funds education, healthcare, sports, and orphan care —
            with zero extra cost to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-white text-hex-green font-extrabold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-base"
            >
              <ShoppingBag size={18} />
              Shop & Give Back
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Learn More
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">
            Joined by {charityStats.ordersWithDonation.toLocaleString()} shoppers who have already made a difference.
          </p>
        </div>
      </section>
    </div>
  );
}
