import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUsers, FiBarChart2, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import Loader from '../components/common/Loader';
import { fetchAdminStats, fetchAdminUsers, createStock, editStock, deactivateStock, resetBalance } from '../redux/slices/adminSlice';
import { fetchStocks } from '../redux/slices/stockSlice';

const TABS = [
  { key: 'stats', label: 'Dashboard Stats', icon: FiBarChart2 },
  { key: 'stocks', label: 'Manage Stocks', icon: FiBarChart2 },
  // { key: 'users', label: 'Manage Users', icon: FiUsers },
];

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer Goods',
  'Industrials',
  'Real Estate',
  'Utilities',
  'Materials',
  'Telecommunications',
];

const initialStockForm = {
  symbol: '',
  name: '',
  sector: '',
  currentPrice: '',
  description: '',
};

const dummyStats = {
  totalUsers: 156,
  totalStocks: 25,
  activeStocks: 25,
  totalTransactions: 1284,
  recentTransactions: [
    { _id: 'at1', user: { name: 'John Doe' }, type: 'BUY', stock: { symbol: 'AAPL' }, quantity: 10, totalAmount: 1898.40, createdAt: '2026-02-28T09:30:00.000Z' },
    { _id: 'at2', user: { name: 'Jane Smith' }, type: 'SELL', stock: { symbol: 'TSLA' }, quantity: 5, totalAmount: 1242.10, createdAt: '2026-02-27T14:20:00.000Z' },
    { _id: 'at3', user: { name: 'Demo User' }, type: 'BUY', stock: { symbol: 'NVDA' }, quantity: 3, totalAmount: 2625.90, createdAt: '2026-02-26T11:00:00.000Z' },
    { _id: 'at4', user: { name: 'Alice Johnson' }, type: 'BUY', stock: { symbol: 'MSFT' }, quantity: 8, totalAmount: 3031.28, createdAt: '2026-02-25T10:45:00.000Z' },
    { _id: 'at5', user: { name: 'Bob Wilson' }, type: 'SELL', stock: { symbol: 'AMZN' }, quantity: 6, totalAmount: 1069.50, createdAt: '2026-02-24T16:30:00.000Z' },
  ],
};

const dummyAdminStocks = [
  { _id: 's1', symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', currentPrice: 189.84, isActive: true, description: 'Apple designs, manufactures, and markets smartphones and personal computers.' },
  { _id: 's2', symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', currentPrice: 141.80, isActive: true, description: 'Alphabet is a holding company for Google and other businesses.' },
  { _id: 's3', symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', currentPrice: 378.91, isActive: true, description: 'Microsoft develops and supports software and services worldwide.' },
  { _id: 's4', symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Goods', currentPrice: 178.25, isActive: true, description: 'Amazon engages in the retail sale of consumer products.' },
  { _id: 's5', symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Goods', currentPrice: 248.42, isActive: true, description: 'Tesla designs and sells electric vehicles.' },
  { _id: 's6', symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', currentPrice: 505.75, isActive: true, description: 'Meta builds technologies that help people connect.' },
  { _id: 's7', symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', currentPrice: 875.30, isActive: true, description: 'NVIDIA provides graphics and compute solutions.' },
  { _id: 's8', symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Finance', currentPrice: 198.50, isActive: true, description: 'JPMorgan Chase is a global financial services firm.' },
  { _id: 's9', symbol: 'V', name: 'Visa Inc.', sector: 'Finance', currentPrice: 281.30, isActive: true, description: 'Visa operates a global payments technology company.' },
  { _id: 's10', symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', currentPrice: 156.20, isActive: true, description: 'Johnson & Johnson operates in the healthcare field.' },
];

const dummyUsers = [
  { _id: 'u1', name: 'Admin User', email: 'admin@sbstocks.com', role: 'admin', balance: 100000, createdAt: '2025-01-01T00:00:00.000Z' },
  { _id: 'u2', name: 'Demo User', email: 'demo@sbstocks.com', role: 'user', balance: 85775.10, createdAt: '2025-01-15T10:00:00.000Z' },
  { _id: 'u3', name: 'John Doe', email: 'john@example.com', role: 'user', balance: 72450.30, createdAt: '2025-03-10T08:30:00.000Z' },
  { _id: 'u4', name: 'Jane Smith', email: 'jane@example.com', role: 'user', balance: 94200.00, createdAt: '2025-04-22T14:15:00.000Z' },
  { _id: 'u5', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', balance: 68900.50, createdAt: '2025-06-05T09:45:00.000Z' },
  { _id: 'u6', name: 'Bob Wilson', email: 'bob@example.com', role: 'user', balance: 110350.75, createdAt: '2025-07-18T11:20:00.000Z' },
];

const AdminPanelPage = () => {
  const dispatch = useDispatch();
  // const { stats, users, loading: statsLoading, usersLoading } = useSelector(state => state.admin);
  const { stats, users, statsLoading, usersLoading } = useSelector(state => state.admin);
  const { list: stocks, searchResults, loading:stocksLoading, pagination } = useSelector((state) => state.stocks);
  
  const [activeTab, setActiveTab] = useState('stats');
  const [stockForm, setStockForm] = useState(initialStockForm);
  const [stockFormLoading, setStockFormLoading] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  // const [stocks, setStocks] = useState([]);
  // const [stocksLoading, setStocksLoading] = useState(false);
  const [resettingUserId, setResettingUserId] = useState(null);

  const fetchStats = useCallback(async () => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  // const fetchStocks = useCallback(async () => {
  //   dispatch(fetchStocks());
  // }, []);

  const fetchUsers = useCallback(async () => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'stocks') dispatch(fetchStocks());
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchStats, fetchStocks, fetchUsers]);


  const handleStockFormChange = (e) => {
    setStockForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStockSubmit = async (e) => {
    e.preventDefault();
    if (!stockForm.symbol || !stockForm.name || !stockForm.currentPrice) {
      toast.error('Symbol, Name, and Price are required');
      return;
    }

    setStockFormLoading(true);
    try {
      if (editingStock) {
        await dispatch(editStock({ stockId: editingStock._id, stockData: stockForm })).unwrap();
        toast.success('Stock updated successfully');
        dispatch(fetchStocks());
      } else {
        await dispatch(createStock(stockForm)).unwrap();
        toast.success('Stock added successfully');
        dispatch(fetchStocks());
      }

      setStockForm(initialStockForm);
      setEditingStock(null);
      fetchStocks();
    } catch (err) {
      toast.error(err || 'Failed to save stock');
    } finally {
      setStockFormLoading(false);
    }
  };

  const handleEditStock = (stock) => {
    setEditingStock(stock);
    setStockForm({
      symbol: stock.symbol || '',
      name: stock.name || '',
      sector: stock.sector || '',
      currentPrice: stock.currentPrice?.toString() || '',
      description: stock.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeactivateStock = async (stockId) => {
    if (!window.confirm('Are you sure you want to deactivate this stock?')) return;
    try {
      await dispatch(deactivateStock(stockId)).unwrap();
      toast.success('Stock deactivated');
      fetchStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate stock');
    }
  };

  const handleResetBalance = async (userId) => {
    if (!window.confirm('Reset this user\'s balance to ₹100,000?')) return;
    try{
    setResettingUserId(userId);
      await dispatch(resetBalance(userId)).unwrap();
      toast.success('Balance reset successfully');
      fetchUsers();
    } catch (err) {
      // toast.error(err
      toast.error(err.response?.data?.message || 'Failed to reset balance');
    } finally {
      setResettingUserId(null);
    }
  };

  const cancelEdit = () => {
    setEditingStock(null);
    setStockForm(initialStockForm);
  };


  const renderStats = () => {
    if (statsLoading) return <Loader text="Loading stats..." />;
    if (!stats) return null;

    const statCards = [
      { label: 'Total Users', value: stats.totalUsers ?? 0, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: FiUsers },
      { label: 'Total Stocks', value: stats.totalStocks ?? 0, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: FiBarChart2 },
      { label: 'Active Stocks', value: stats.totalStocks ?? 0, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', icon: FiBarChart2 },
      { label: 'Total Transactions', value: stats.totalTransactions ?? 0, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: FiRefreshCw },
    ];

    return (
      <div className="space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <div key={card.label} className="card flex items-center gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        {stats.recentTransactions && stats.recentTransactions.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">User</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Total</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.slice(0, 5).map((txn) => (
                    <tr key={txn._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{txn.user?.name || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${txn.type === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{txn.stock?.symbol || 'N/A'}</td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{txn.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{formatCurrency(txn.totalAmount || txn.total || 0)}</td>
                      <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 text-xs">{formatDateTime(txn.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStocks = () => {
    return (
      <div className="space-y-8">
       
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            {editingStock ? 'Edit Stock' : 'Add New Stock'}
          </h3>
          <form onSubmit={handleStockSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Symbol *</label>
                <input
                  type="text"
                  name="symbol"
                  value={stockForm.symbol}
                  onChange={handleStockFormChange}
                  placeholder="e.g. AAPL"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={stockForm.name}
                  onChange={handleStockFormChange}
                  placeholder="e.g. Apple Inc."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sector</label>
                <select
                  name="sector"
                  value={stockForm.sector}
                  onChange={handleStockFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select Sector</option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                <input
                  type="number"
                  name="currentPrice"
                  value={stockForm.currentPrice}
                  onChange={handleStockFormChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={stockForm.description}
                  onChange={handleStockFormChange}
                  placeholder="Brief description of the stock"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={stockFormLoading}
                className="btn-primary flex items-center gap-2"
              >
                {stockFormLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiPlus className="w-4 h-4" />
                )}
                {editingStock ? 'Update Stock' : 'Add Stock'}
              </button>
              {editingStock && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Stocks</h3>
          {stocksLoading ? (
            <Loader text="Loading stocks..." />
          ) : stocks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No stocks found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Symbol</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Sector</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-3 px-4 font-bold text-primary-600 dark:text-primary-400">{stock.symbol}</td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{stock.name}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{stock.sector || '-'}</td>
                      <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{formatCurrency(stock.currentPrice)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${stock.isActive !== false ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {stock.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditStock(stock)}
                            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-xs px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeactivateStock(stock._id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-1"
                          >
                            <FiTrash2 className="w-3 h-3" />
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (usersLoading) return <Loader text="Loading users..." />;

    return (
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">All Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Balance</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white font-medium">{formatCurrency(user.balance)}</td>
                    <td className="py-3 px-4 text-right text-gray-500 dark:text-gray-400 text-xs">{formatDateTime(user.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleResetBalance(user._id)}
                        disabled={resettingUserId === user._id}
                        className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-xs px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 transition disabled:opacity-50"
                      >
                        <FiRefreshCw className={`w-3 h-3 ${resettingUserId === user._id ? 'animate-spin' : ''}`} />
                        Reset Balance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your platform stocks, users, and view analytics.</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && renderStats()}
      {activeTab === 'stocks' && renderStocks()}
      {activeTab === 'users' && renderUsers()}
    </div>
  );
};

export default AdminPanelPage;
