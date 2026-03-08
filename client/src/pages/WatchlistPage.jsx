import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import { FiX, FiTrendingUp, FiTrendingDown, FiEye, FiPlus } from 'react-icons/fi';

const WatchlistPage = () => {
  const dispatch = useDispatch();
  const { stocks, loading } = useSelector((state) => state.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const handleRemove = async (stockId, symbol) => {
    try {
      await dispatch(removeFromWatchlist(stockId)).unwrap();
      toast.success(`${symbol} removed from watchlist`);
    } catch (err) {
      toast.error(err || 'Failed to remove from watchlist');
    }
  };

  if (loading) return <Loader text="Loading watchlist..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Watchlist</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {stocks.length > 0
              ? `Tracking ${stocks.length} stock${stocks.length !== 1 ? 's' : ''}`
              : 'Track your favorite stocks'}
          </p>
        </div>
        <Link
          to="/stocks"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          <FiPlus size={16} />
          Browse Stocks
        </Link>
      </div>

      {stocks.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiEye className="text-primary-600" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No stocks in your watchlist
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your watchlist is empty. Browse stocks to add some!
          </p>
          <Link
            to="/stocks"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            <FiPlus size={16} />
            Browse Stocks
          </Link>
        </div>
      )}

      {stocks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {stocks.map((stock) => {
            const change = stock.currentPrice - stock.previousClose;
            const changePercent = stock.previousClose
              ? ((change / stock.previousClose) * 100)
              : 0;
            const isPositive = change >= 0;

            return (
              <div
                key={stock._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => handleRemove(stock._id, stock.symbol)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from watchlist"
                >
                  <FiX size={16} />
                </button>

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {stock.symbol}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {stock.name}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stock.currentPrice || stock.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      isPositive
                        ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                        : 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
                    }`}
                  >
                    {isPositive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                    {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
                  </div>
                </div>

                {stock.sector && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {stock.sector}
                  </p>
                )}

                <Link
                  to={`/stocks/${stock.symbol}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  <FiEye size={14} />
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
