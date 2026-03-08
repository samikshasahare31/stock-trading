import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPortfolioSummary } from '../redux/slices/portfolioSlice';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import Loader from '../components/common/Loader';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiPieChart,
  FiStar,
  FiHelpCircle,
  FiEye,
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { summary, loading: portfolioLoading } = useSelector((state) => state.portfolio);
  const { list: transactions, historyLoading } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
    dispatch(fetchTransactions({ page: 1, limit: 5 }));
  }, [dispatch]);

  const loading = portfolioLoading || historyLoading;

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  const quickActions = [
    {
      label: 'Browse Stocks',
      to: '/stocks',
      icon: <FiTrendingUp className="w-6 h-6" />,
      color: 'bg-primary-100 dark:bg-primary-900 text-primary-600',
      description: 'Explore the stock market',
    },
    {
      label: 'View Portfolio',
      to: '/portfolio',
      icon: <FiPieChart className="w-6 h-6" />,
      color: 'bg-success-50 dark:bg-green-900 text-success-600',
      description: 'See your holdings',
    },
    {
      label: 'Watchlist',
      to: '/watchlist',
      icon: <FiStar className="w-6 h-6" />,
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600',
      description: 'Stocks you follow',
    },
    
  ];

  const summaryCards = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(summary?.totalPortfolioValue || 0),
      icon: <FaRupeeSign className="w-5 h-5" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100 dark:bg-primary-900',
    },
    {
      label: 'Total Invested',
      value: formatCurrency(summary?.totalInvested || 0),
      icon: <FiPieChart className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Profit / Loss',
      value: formatCurrency(summary?.totalProfitLoss || 0),
      icon: (summary?.totalProfitLoss || 0) >= 0
        ? <FiTrendingUp className="w-5 h-5" />
        : <FiTrendingDown className="w-5 h-5" />,
      color: (summary?.totalProfitLoss || 0) >= 0 ? 'text-success-600' : 'text-danger-600',
      bgColor: (summary?.totalProfitLoss || 0) >= 0
        ? 'bg-success-50 dark:bg-green-900'
        : 'bg-danger-50 dark:bg-red-900',
    },
    {
      label: 'Overall Return',
      value: formatPercent(summary?.overallReturn || 0),
      icon: (summary?.overallReturn || 0) >= 0
        ? <FiTrendingUp className="w-5 h-5" />
        : <FiTrendingDown className="w-5 h-5" />,
      color: (summary?.overallReturn || 0) >= 0 ? 'text-success-600' : 'text-danger-600',
      bgColor: (summary?.overallReturn || 0) >= 0
        ? 'bg-success-50 dark:bg-green-900'
        : 'bg-danger-50 dark:bg-red-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Trader'}!
        </h1>
      </div>

      <div className="card mb-8 bg-gradient-to-r from-primary-600 to-primary-800 border-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm font-medium">Virtual Balance</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
              {formatCurrency(user?.virtualBalance ?? summary?.virtualBalance ?? 0)}
            </p>
          </div>
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/10 items-center justify-center">
            <FaRupeeSign className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((item) => (
          <div key={item.label} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-10">
            <FaRupeeSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
            <Link to="/stocks" className="btn-primary inline-block mt-4 text-sm">
              Start Trading
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Qty</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Price</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                  <th className="pb-3 font-medium text-right hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tx.type === 'BUY'
                            ? 'bg-success-50 text-success-600 dark:bg-green-900 dark:text-green-400'
                            : 'bg-danger-50 text-danger-600 dark:bg-red-900 dark:text-red-400'
                          }`}
                      >
                        {tx.type === 'BUY' ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">
                      {tx.stock?.symbol || tx.symbol}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                      {tx.quantity}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                      {formatCurrency(tx.pricePerShare)}
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(tx.totalAmount)}
                    </td>
                    <td className="py-3 text-right text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {formatDateTime(tx.createdAt)}
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

export default DashboardPage;
