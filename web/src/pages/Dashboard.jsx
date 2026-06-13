import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, TrendingUp, LogOut, Settings, User, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import { charityStats } from '../data/mockData';

const mockOrders = [
  { id: 'ORD-001', date: 'Jun 10, 2025', items: 2, total: 89.98, status: 'Delivered', charity: 4.50 },
  { id: 'ORD-002', date: 'Jun 7, 2025', items: 1, total: 49.99, status: 'Shipped', charity: 3.50 },
  { id: 'ORD-003', date: 'Jun 1, 2025', items: 3, total: 164.97, status: 'Delivered', charity: 9.75 },
];

export default function Dashboard() {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <User size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-hex-secondary mb-2">Sign in to view your dashboard</h2>
        <Link
          to="/login"
          className="mt-4 bg-hex-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const totalSpent = mockOrders.reduce((s, o) => s + o.total, 0);
  const totalCharity = mockOrders.reduce((s, o) => s + o.charity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-hex-primary rounded-2xl flex items-center justify-center text-white text-xl font-extrabold">
            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-hex-secondary">
              {user.name || user.email?.split('@')[0]}
            </h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-hex-accent transition-colors border border-gray-200 px-4 py-2 rounded-lg hover:border-hex-accent"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <ShoppingBag size={20} className="text-hex-primary" />, label: 'Total Orders', value: mockOrders.length, bg: 'bg-hex-primary/10' },
          { icon: <TrendingUp size={20} className="text-hex-gold" />, label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, bg: 'bg-hex-gold/10' },
          { icon: <Heart size={20} className="text-hex-green" fill="currentColor" />, label: 'Charity Donated', value: `$${totalCharity.toFixed(2)}`, bg: 'bg-hex-green/10' },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-xl font-extrabold text-hex-secondary">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order history */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="font-bold text-lg text-hex-secondary mb-5">Order History</h2>
            <div className="space-y-3">
              {mockOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-sm text-hex-secondary">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.date} • {order.items} item{order.items > 1 ? 's' : ''}</p>
                    <p className="text-xs text-hex-green mt-0.5">💚 ${order.charity.toFixed(2)} donated</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-hex-secondary">${order.total.toFixed(2)}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.status === 'Delivered' ? 'bg-hex-green/10 text-hex-green' : 'bg-hex-primary/10 text-hex-primary'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/marketplace"
              className="block mt-4 text-center text-sm text-hex-primary font-semibold hover:underline"
            >
              Browse More Products →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Charity impact */}
          <div className="bg-hex-green/10 border border-hex-green/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} className="text-hex-green fill-hex-green" />
              <h3 className="font-bold text-hex-green">Your Impact</h3>
            </div>
            <p className="text-2xl font-extrabold text-hex-green mb-1">${totalCharity.toFixed(2)}</p>
            <p className="text-xs text-gray-600">donated through your purchases</p>
            <Link to="/charity" className="mt-3 block text-xs text-hex-green font-semibold hover:underline">
              See where it went →
            </Link>
          </div>

          {/* Account menu */}
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <h3 className="font-bold text-sm text-hex-secondary mb-3 px-2">Account</h3>
            {[
              { icon: <Settings size={16} />, label: 'Account Settings', to: '#' },
              { icon: <Heart size={16} />, label: 'Saved Products', to: '/marketplace' },
              { icon: <TrendingUp size={16} />, label: 'Creator Dashboard', to: '/creators' },
            ].map(({ icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-hex-primary"
              >
                <div className="flex items-center gap-2.5">{icon}<span>{label}</span></div>
                <ChevronRight size={14} className="text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
