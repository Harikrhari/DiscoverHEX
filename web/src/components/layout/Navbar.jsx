import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Zap, User, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

const navLinks = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/sponsors', label: 'Sponsors' },
  { to: '/creators', label: 'Creators' },
  { to: '/charity', label: 'Charity' },
  { to: '/invest', label: 'Invest' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useStore((s) => s.cartCount());
  const openCart = useStore((s) => s.openCart);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-hex-green text-white text-center text-sm py-2 px-4 font-medium">
        💚 5–10% of every purchase goes directly to charity — track it live on our{' '}
        <Link to="/charity" className="underline font-bold">Charity Page</Link>
      </div>

      <nav className="bg-hex-secondary text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Zap className="text-hex-primary" size={24} />
              <span className="text-white">Discover</span>
              <span className="text-hex-primary">HEX</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-hex-primary ${
                      isActive ? 'text-hex-primary' : 'text-gray-300'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={openCart}
                className="relative p-2 hover:text-hex-primary transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-hex-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              <Link
                to="/invest"
                className="hidden sm:block bg-hex-primary hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Invest in HEX
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-hex-primary transition-colors px-2 py-2"
                  >
                    <User size={18} />
                    <span className="hidden lg:inline">{user.name || user.email?.split('@')[0]}</span>
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="text-gray-400 hover:text-hex-accent transition-colors p-2"
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:block text-sm text-gray-300 hover:text-hex-primary transition-colors px-2 py-2"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-hex-secondary border-t border-gray-700 px-4 pb-4">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-sm font-medium border-b border-gray-700 ${
                    isActive ? 'text-hex-primary' : 'text-gray-300'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/invest"
              onClick={() => setMenuOpen(false)}
              className="block mt-4 bg-hex-primary text-white text-center text-sm font-bold px-4 py-3 rounded-lg"
            >
              Invest in HEX
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
