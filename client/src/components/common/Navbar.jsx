import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              SB Stocks
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Dashboard</Link>
              <Link to="/stocks" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Stocks</Link>
              <Link to="/portfolio" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Portfolio</Link>
              <Link to="/watchlist" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Watchlist</Link>
              <Link to="/transactions" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">History</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Admin</Link>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              {dark ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-500" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                  <p className="text-sm font-bold text-primary-600">{formatCurrency(user.virtualBalance)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">{user.name[0]}</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-danger-600">Logout</button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 py-3 space-y-2">
          {user ? (
            <>
              <p className="text-sm font-bold text-primary-600 mb-2">Balance: {formatCurrency(user.virtualBalance)}</p>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Dashboard</Link>
              <Link to="/stocks" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Stocks</Link>
              <Link to="/portfolio" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Portfolio</Link>
              <Link to="/watchlist" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Watchlist</Link>
              <Link to="/transactions" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">History</Link>
              <Link to="/how-to-use" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">How to Use</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Admin</Link>}
              <button onClick={handleLogout} className="block py-2 text-danger-600 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 dark:text-gray-300">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
