import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/marketplace/CartDrawer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Charity from './pages/Charity';
import Sponsors from './pages/Sponsors';
import Crowdfunding from './pages/Crowdfunding';
import Influencers from './pages/Influencers';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/charity" element={<Charity />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/invest" element={<Crowdfunding />} />
          <Route path="/creators" element={<Influencers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
