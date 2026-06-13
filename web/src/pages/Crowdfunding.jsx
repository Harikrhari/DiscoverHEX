import { useState } from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Shield,
  ChevronDown,
  X,
} from 'lucide-react';

const CAMPAIGNS = [
  {
    id: 'camp1',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800',
    title: 'HEX Creator Studio App',
    tagline: 'The all-in-one platform for content creators',
    description:
      'A mobile-first app giving creators real-time analytics, AI caption generation, one-tap social posting, and brand deal management — all in one place. We\'re building the operating system for the creator economy.',
    raised: 284000,
    goal: 500000,
    investors: 1247,
    daysLeft: 18,
    minInvestment: 250,
    equity: '12% equity pool',
    roi: 'Est. 8–14x return by Year 5',
    stage: 'Seed',
    stageColor: '#27AE60',
    perks: [
      { amount: 250, reward: 'Investor badge + lifetime 10% discount on HEX' },
      { amount: 1000, reward: 'Above + early app access + quarterly investor calls' },
      { amount: 5000, reward: 'Above + 0.5% equity + co-creator advisory board seat' },
      { amount: 10000, reward: 'Above + 1.2% equity + revenue sharing at Year 3+ profit' },
    ],
  },
  {
    id: 'camp2',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    title: 'HEX Flagship Store — Chicago',
    tagline: 'A physical experience center for the HEX brand',
    description:
      'We\'re opening a 6,000 sq ft experiential retail space in Chicago\'s Wicker Park — combining a curated product showroom, creator content studio, community event space, and charity donation kiosk. This is HEX IRL.',
    raised: 892000,
    goal: 1500000,
    investors: 3218,
    daysLeft: 31,
    minInvestment: 500,
    equity: '8% preferred equity',
    roi: 'Est. 6–10x return by Year 4',
    stage: 'Series A',
    stageColor: '#FF6B35',
    perks: [
      { amount: 500, reward: 'Founding Member plaque in store + 15% lifetime discount' },
      { amount: 2500, reward: 'Above + VIP grand opening invite + exclusive product drops' },
      { amount: 10000, reward: 'Above + 0.25% preferred equity + private event hosting rights' },
      { amount: 50000, reward: 'Above + 1% preferred equity + named space in the store' },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <TrendingUp size={24} />,
    title: 'Browse Campaigns',
    desc: 'Explore active investment opportunities across HEX ventures. Each listing includes financials, projections, and equity details.',
  },
  {
    step: '02',
    icon: <DollarSign size={24} />,
    title: 'Choose Your Investment Tier',
    desc: 'Pick an amount that fits your goals. Every tier comes with perks, and higher commitments earn equity stakes.',
  },
  {
    step: '03',
    icon: <Shield size={24} />,
    title: 'Track Your ROI',
    desc: 'Access your investor dashboard for real-time portfolio updates, quarterly reports, and milestone announcements.',
  },
];

const FAQS = [
  {
    q: 'Is this a regulated securities offering?',
    a: 'HEX crowdfunding campaigns operate under Regulation Crowdfunding (Reg CF) guidelines. All formal investment agreements are issued only after SEC filings are confirmed. Expressing interest here is non-binding.',
  },
  {
    q: 'What returns can I expect on my investment?',
    a: 'Projections vary by campaign and are not guaranteed. Conservative to optimistic Year-5 estimates are shown on each campaign card. Past performance is not indicative of future results. Read the full financial disclosures before committing.',
  },
  {
    q: 'How do I receive my equity stake and payouts?',
    a: 'Upon round close and SEC confirmation, you will receive a digital SAFE agreement (Simple Agreement for Future Equity). Payouts occur at liquidity events — acquisition, IPO, or agreed profit-sharing milestones. You can track everything in your investor dashboard.',
  },
];

function ProgressBar({ raised, goal }) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="font-bold text-white">${raised.toLocaleString()} raised</span>
        <span className="text-gray-400">Goal: ${goal.toLocaleString()}</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: '#F5A623' }}
        />
      </div>
      <div className="text-right text-xs mt-1" style={{ color: '#F5A623' }}>
        {pct}% funded
      </div>
    </div>
  );
}

function CampaignCard({ campaign, onInvest }) {
  const [imgError, setImgError] = useState(false);
  const [perksOpen, setPerksOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:border-white/20 transition-all"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {!imgError ? (
          <img
            src={campaign.image}
            alt={campaign.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-black text-2xl"
            style={{ backgroundColor: '#1A1A2E' }}
          >
            HEX
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span
          className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: campaign.stageColor }}
        >
          {campaign.stage}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        <div>
          <h3 className="text-xl font-black text-white mb-1">{campaign.title}</h3>
          <p className="text-sm font-medium" style={{ color: '#F5A623' }}>{campaign.tagline}</p>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{campaign.description}</p>

        <ProgressBar raised={campaign.raised} goal={campaign.goal} />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center rounded-xl p-3 border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Users size={16} className="mx-auto mb-1 text-gray-400" />
            <div className="text-white font-black text-sm">{campaign.investors.toLocaleString()}</div>
            <div className="text-gray-500 text-xs">Investors</div>
          </div>
          <div className="text-center rounded-xl p-3 border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <Clock size={16} className="mx-auto mb-1 text-gray-400" />
            <div className="text-white font-black text-sm">{campaign.daysLeft}</div>
            <div className="text-gray-500 text-xs">Days Left</div>
          </div>
          <div className="text-center rounded-xl p-3 border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <DollarSign size={16} className="mx-auto mb-1 text-gray-400" />
            <div className="text-white font-black text-sm">${campaign.minInvestment}</div>
            <div className="text-gray-500 text-xs">Min. Invest</div>
          </div>
        </div>

        {/* Equity / ROI */}
        <div className="rounded-xl p-4 border border-white/10 flex flex-col gap-1" style={{ backgroundColor: 'rgba(245,166,35,0.07)' }}>
          <div className="flex items-center gap-2 text-sm">
            <Shield size={14} style={{ color: '#F5A623' }} />
            <span className="text-gray-300">{campaign.equity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={14} style={{ color: '#27AE60' }} />
            <span className="text-gray-300">{campaign.roi}</span>
          </div>
        </div>

        {/* Perks accordion */}
        <div>
          <button
            className="flex items-center justify-between w-full text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            onClick={() => setPerksOpen((v) => !v)}
          >
            <span>Investment Perks</span>
            <ChevronDown
              size={16}
              className="transition-transform"
              style={{ transform: perksOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {perksOpen && (
            <div className="mt-3 flex flex-col gap-2">
              {campaign.perks.map((p) => (
                <div
                  key={p.amount}
                  className="rounded-lg p-3 flex gap-3 items-start border border-white/8"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <span className="font-black text-sm shrink-0" style={{ color: '#F5A623' }}>
                    ${p.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs leading-relaxed">{p.reward}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="mt-auto w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 active:scale-[.98]"
          style={{ backgroundColor: '#FF6B35' }}
          onClick={() => onInvest(campaign)}
        >
          Invest Now
        </button>
      </div>
    </div>
  );
}

function InvestModal({ campaign, onClose }) {
  const [amount, setAmount] = useState(campaign.minInvestment);
  const [toast, setToast] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleConfirm(e) {
    e.preventDefault();
    if (amount < campaign.minInvestment) return;
    setSubmitted(true);
    setToast(`Investment of $${Number(amount).toLocaleString()} in "${campaign.title}" confirmed! You'll receive confirmation via email.`);
    setTimeout(() => {
      setToast('');
      onClose();
    }, 3000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
      {toast && (
        <div
          className="fixed top-6 right-6 z-[60] px-6 py-3 rounded-xl shadow-2xl text-white font-semibold max-w-sm"
          style={{ backgroundColor: '#27AE60' }}
        >
          {toast}
        </div>
      )}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 p-8 flex flex-col gap-6"
        style={{ backgroundColor: '#1A1A2E' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Invest Now</h2>
          <p className="text-sm font-medium" style={{ color: '#FF6B35' }}>{campaign.title}</p>
        </div>
        <div className="rounded-xl p-4 border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
          <div className="text-xs text-gray-400 mb-1">Campaign Progress</div>
          <ProgressBar raised={campaign.raised} goal={campaign.goal} />
        </div>
        {!submitted ? (
          <form onSubmit={handleConfirm} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Investment Amount (min. ${campaign.minInvestment})
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  min={campaign.minInvestment}
                  step={50}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 pl-8 pr-4 py-3 text-white text-lg font-black focus:outline-none focus:border-orange-500/50 transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  required
                />
              </div>
              {amount < campaign.minInvestment && (
                <p className="text-xs mt-1" style={{ color: '#E94560' }}>
                  Minimum investment is ${campaign.minInvestment}
                </p>
              )}
            </div>
            <div className="rounded-xl p-4 border border-white/10 text-sm" style={{ backgroundColor: 'rgba(245,166,35,0.07)' }}>
              <div className="text-gray-300 mb-1">{campaign.equity}</div>
              <div className="text-gray-400 text-xs">{campaign.roi}</div>
            </div>
            <button
              type="submit"
              disabled={amount < campaign.minInvestment}
              className="w-full py-4 rounded-xl font-black text-white text-base transition-all hover:opacity-90 active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Confirm Investment — ${Number(amount).toLocaleString()}
            </button>
            <p className="text-center text-xs text-gray-500">
              Non-binding reservation. Formal documents issued upon round close and SEC confirmation.
            </p>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-white font-black text-xl mb-2">Investment Confirmed!</div>
            <div className="text-gray-400 text-sm">Check your email for next steps.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden transition-all"
      style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
    >
      <button
        className="w-full flex items-center justify-between p-5 text-left text-white font-semibold hover:bg-white/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        <ChevronDown
          size={18}
          className="shrink-0 text-gray-400 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5">
          <div className="pt-3">{a}</div>
        </div>
      )}
    </div>
  );
}

export default function Crowdfunding() {
  const [activeCampaign, setActiveCampaign] = useState(null);

  const heroStats = [
    { icon: <TrendingUp size={20} />, value: '$1.18M', label: 'Total Raised' },
    { icon: <Users size={20} />, value: '4,465', label: 'Total Investors' },
    { icon: <DollarSign size={20} />, value: '$250', label: 'Min. Investment' },
    { icon: <Shield size={20} />, value: 'Reg CF', label: 'SEC Compliant' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F1A' }}>
      {/* Modal */}
      {activeCampaign && (
        <InvestModal campaign={activeCampaign} onClose={() => setActiveCampaign(null)} />
      )}

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 text-center" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#FF6B35' }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ backgroundColor: '#F5A623' }} />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 border"
            style={{ backgroundColor: 'rgba(255,107,53,0.12)', borderColor: 'rgba(255,107,53,0.3)', color: '#FF6B35' }}
          >
            <TrendingUp size={14} />
            Equity Crowdfunding
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Invest in the Future of{' '}
            <span style={{ color: '#FF6B35' }}>Commerce</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Become an equity owner in DiscoverHEX ventures. Back the projects reshaping how
            people shop, create, and give — and share in the upside.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {heroStats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-5 border border-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex justify-center mb-2 text-gray-400">{s.icon}</div>
                <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campaign Cards ─────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Active Campaigns</h2>
          <p className="text-gray-400 text-center mb-14">Two open rounds — limited slots available</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {CAMPAIGNS.map((c) => (
              <CampaignCard key={c.id} campaign={c} onInvest={setActiveCampaign} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5" style={{ backgroundColor: '#1A1A2E' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">How It Works</h2>
          <p className="text-gray-400 text-center mb-14">Three steps to becoming a HEX investor</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center flex flex-col items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,107,53,0.15)', color: '#FF6B35' }}
                >
                  {step.icon}
                </div>
                <div
                  className="text-xs font-black tracking-widest"
                  style={{ color: '#FF6B35' }}
                >
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-black text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-center mb-12">Everything you need to know before investing</p>
          <div className="flex flex-col gap-4">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">
            This is not financial advice. All investments carry risk. Please read full disclosures before committing funds.
          </p>
        </div>
      </section>
    </div>
  );
}
