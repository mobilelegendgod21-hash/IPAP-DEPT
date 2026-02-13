import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { CartDrawer } from './components/CartDrawer';
import ProfilePage from './pages/Profile';
import { useCartStore } from './store';
import { Product } from './types';
import { PRODUCTS } from './constants';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminLogin from './pages/AdminLogin';
import AdminRegistration from './pages/AdminRegistration';
import AdminDashboard from './pages/AdminDashboard';
import { ConfirmationModal } from './components/ConfirmationModal';

type ViewState = 'HOME' | 'PRODUCT' | 'CHECKOUT' | 'SUCCESS' | 'LOGIN' | 'REGISTER' | 'PROFILE' | 'ADMIN_LOGIN' | 'ADMIN_REGISTER' | 'ADMIN_DASHBOARD';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('secret') === 'admin' ? 'ADMIN_LOGIN' : 'HOME';
  });
  const [activeProduct, setActiveProduct] = useState<Product>(PRODUCTS[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, is_admin')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.full_name || 'User');
        setAvatarUrl(data.avatar_url || '');
        setIsAdmin(data.is_admin || false);
      }
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) fetchUserProfile();
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        fetchUserProfile();
      } else {
        setUsername('');
        setAvatarUrl('');
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Secret URL Access Restrictions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSecretAdmin = params.get('secret') === 'admin';

    if (isSecretAdmin && isLoggedIn) {
      // Wait for profile fetch to confirm admin status (isAdmin defaults false, but username would be set if fetch happened)
      // We can check username or just wait a tick. Ideally isAdmin is set quickly.
      // For simplicity, we trigger only if we have username which implies profile loaded.
      if (username) {
        if (isAdmin) {
          if (view !== 'ADMIN_DASHBOARD') setView('ADMIN_DASHBOARD');
        } else {
          alert('You are currently logged in as a standard user. Please logout to access the Admin Portal.');
          setView('HOME');
          // Optional: Clean URL
          // window.history.replaceState({}, '', '/');
        }
      }
    }
  }, [isLoggedIn, isAdmin, username, view]); // isSecretAdmin isn't state, define it inside or outside?
  // Check the deps logic carefully in next block.

  // Clean URL when navigating away from Admin
  useEffect(() => {
    if (!['ADMIN_LOGIN', 'ADMIN_REGISTER', 'ADMIN_DASHBOARD'].includes(view)) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('secret') === 'admin') {
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }
    }
  }, [view]);

  const cartCount = useCartStore((state) => state.items.length);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleProductClick = (product: Product) => {
    setActiveProduct(product);
    setView('PRODUCT');
    window.scrollTo(0, 0);
  };

  const handleCheckoutStart = () => {
    setView('CHECKOUT');
  };

  const handleOrderSuccess = () => {
    clearCart();
    setView('SUCCESS');
  };

  const handleLogoutClick = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = async () => {
    await supabase.auth.signOut();
    setView('HOME');
    setLogoutConfirmOpen(false);
    // setIsLoggedIn(false); // Handled by onAuthStateChange
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return <Home onProductClick={handleProductClick} />;
      case 'PRODUCT':
        return activeProduct ? (
          <ProductDetails
            product={activeProduct}
            onBack={() => setView('HOME')}
          />
        ) : <Home onProductClick={handleProductClick} />;
      case 'CHECKOUT':
        return <Checkout onBack={() => setView('HOME')} onSuccess={handleOrderSuccess} />;
      case 'LOGIN':
        return <Login setView={setView} setIsLoggedIn={setIsLoggedIn} />;
      case 'REGISTER':
        return <Registration setView={setView} />;
      case 'PROFILE':
        return <ProfilePage setView={setView} onProfileUpdate={fetchUserProfile} />;
      case 'ADMIN_LOGIN':
        return <AdminLogin setView={setView} />;
      case 'ADMIN_REGISTER':
        return <AdminRegistration setView={setView} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard setView={setView} />;
      case 'SUCCESS':
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-8 max-w-sm">Your items will be shipped by the seller soon. You can track status in "My Orders".</p>
            <button onClick={() => setView('HOME')} className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest">
              Continue Shopping
            </button>
          </div>
        );
      default:
        return <Home onProductClick={handleProductClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Navigation (Only show on Home, Product, Profile) */}
      {(view === 'HOME' || view === 'PRODUCT' || view === 'PROFILE') && (
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="font-black tracking-tighter text-xl cursor-pointer italic" onClick={() => setView('HOME')}>
                IPAP DEPT
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Bar Simulation */}
              <div className="hidden md:flex items-center bg-gray-100 px-3 h-9 rounded w-64 mr-4">
                <svg className="text-gray-400 w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search products..." className="bg-transparent text-sm w-full outline-none placeholder:text-gray-400" />
              </div>

              {isLoggedIn && (
                <>
                  <button onClick={() => setView('PROFILE')} className="text-sm font-medium text-gray-700 hover:text-gray-900 mr-2 max-w-[150px] truncate">
                    {username || 'User'}
                  </button>
                  <button onClick={handleLogoutClick} className="text-sm font-medium text-gray-700 hover:text-gray-900">Logout</button>
                </>
              )}


              {isLoggedIn && (
                <div className="w-8 h-8 bg-gray-200 rounded-full ml-2 overflow-hidden cursor-pointer border border-gray-100" onClick={() => setView('PROFILE')}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main>
        {renderContent()}
      </main>

      <CartDrawer onCheckout={handleCheckoutStart} />

      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
      />


    </div>
  );
};
export default App;