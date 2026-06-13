import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Users } from 'lucide-react';
import { charityCampaigns, charityStats } from '../data/mockData';

export default function Charity() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hex-green text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Heart size={48} className="mx-auto mb-4 fill-white" />
          <h1 className="text-4xl font-extrabold mb-4">Every Purchase Helps</h1>
          <p className="text-lg text-white/80 mb-6">
            5–10% of every DiscoverHEX order goes directly to verified causes. No guessing, no middlemen — full transparency.
          </p>
          <div className="grid grid-cols-3 gap-6 bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div><div className="text-3xl font-bold">${charityStats.totalDonated.toLocaleString()}</div><div className="text-sm text-white/70 mt-1">Total Donated</div></div>
            <div><div className="text-3xl font-bold">{charityStats.beneficiaries}+</div><div className="text-sm text-white/70 mt-1">Lives Impacted</div></div>
            <div><div className="text-3xl font-bold">{charityStats.activeCampaigns}</div><div className="text-sm text-white/70 mt-1">Active Campaigns</div></div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-hex-secondary mb-8 text-center">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charityCampaigns.map((c) => {
            const pct = Math.round((c.raised / c.goal) * 100);
            return (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{c.icon}</span>
                  <div>
                    <h3 className="font-bold text-hex-secondary text-lg">{c.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {c.beneficiaries} beneficiaries • {c.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{c.description}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span style={{ color: c.color }}>${c.raised.toLocaleString()} raised</span>
                    <span className="text-gray-400">{pct}% of ${c.goal.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>

                {/* Impact stories */}
                {c.stories.map((story, i) => (
                  <div key={i} className="mt-3 bg-gray-50 rounded-xl p-3 text-sm">
                    <p className="font-semibold text-gray-800">{story.name} — <span className="text-gray-400 text-xs">{story.location}</span></p>
                    <p className="text-gray-600 text-xs mt-0.5">{story.impact}</p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-hex-secondary mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', label: 'You Shop', desc: 'Browse and buy any product on DiscoverHEX' },
              { step: '2', label: 'We Allocate', desc: '5–10% of your purchase is automatically sent to charity' },
              { step: '3', label: 'You Track', desc: 'See exactly where your contribution went — updated in real time' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-hex-green text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">{step}</div>
                <h3 className="font-bold text-hex-secondary mb-2">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-hex-secondary mb-4">Make Your Next Purchase Count</h2>
        <p className="text-gray-500 mb-6">Every order you place directly funds education, healthcare, sports, and orphan care.</p>
        <Link
          to="/marketplace"
          className="inline-block bg-hex-green hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-colors"
        >
          Shop & Give Back
        </Link>
      </section>
    </div>
  );
}
