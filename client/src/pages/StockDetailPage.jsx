import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDetail, clearSelectedStock } from '../redux/slices/stockSlice';
import { fetchPortfolio } from '../redux/slices/portfolioSlice';
import { addToWatchlist } from '../redux/slices/watchlistSlice';
import BuySellModal from '../components/stocks/BuySellModal';
import StockPriceChart from '../components/stocks/StockPriceChart';
import Loader from '../components/common/Loader';
import { formatCurrency, formatNumber } from '../utils/formatCurrency';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiTrendingUp,
  FiTrendingDown,
  FiStar,
  FiBarChart2,
  FiInfo,
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedStock: stock, loading } = useSelector((state) => state.stocks);
  const { holdings } = useSelector((state) => state.portfolio);

  const [showModal, setShowModal] = useState(false);

  const holding = useMemo(() => {
    if (!stock || !holdings || holdings.length === 0) return null;
    return holdings.find((h) => h.stock?._id === stock._id || h.stock?.symbol === stock.symbol) || null;
  }, [stock, holdings]);

  useEffect(() => {
    dispatch(fetchStockDetail(symbol));
    dispatch(fetchPortfolio());

    return () => {
      dispatch(clearSelectedStock());
    };
  }, [dispatch, symbol]);

  const handleAddToWatchlist = async () => {
    if (!stock) return;
    try {
      await dispatch(addToWatchlist(stock._id)).unwrap();
      toast.success(`${stock.symbol} added to watchlist`);
    } catch (err) {
      toast.error(err || 'Failed to add to watchlist');
    }
  };

  const handleTradeSuccess = () => {
    dispatch(fetchStockDetail(symbol));
    dispatch(fetchPortfolio());
  };

  if (loading || !stock) {
    return <Loader text={`Loading ${symbol}...`} />;
  }

  const priceChange = stock.currentPrice - (stock.previousClose || stock.currentPrice);
  const priceChangePercent =
    stock.previousClose && stock.previousClose !== 0
      ? ((priceChange / stock.previousClose) * 100).toFixed(2)
      : '0.00';
  const isPositive = priceChange >= 0;

  const holdingPL = holding
    ? (stock.currentPrice - holding.averageBuyPrice) * holding.quantity
    : 0;
  const holdingPLPercent = holding && holding.averageBuyPrice > 0
    ? (((stock.currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/stocks')}
        className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium mb-6 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Stocks
      </button>
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {stock.symbol}
              </h1>
              {stock.sector && (
                <span className="text-xs font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-full">
                  {stock.sector}
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {stock.companyName || stock.name}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(stock.currentPrice || stock.price)}
            </p>
            <div
              className={`inline-flex items-center gap-1.5 mt-1 text-sm font-semibold ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? (
                <FiTrendingUp className="w-4 h-4" />
              ) : (
                <FiTrendingDown className="w-4 h-4" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {formatCurrency(priceChange)} ({isPositive ? '+' : ''}
                {priceChangePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          <FaRupeeSign className="w-4 h-4" />
          BUY
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          <FaRupeeSign className="w-4 h-4" />
          SELL
        </button>
        <button
          onClick={handleAddToWatchlist}
          className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <FiStar className="w-4 h-4" />
          Add to Watchlist
        </button>
      </div>
      <div className="mb-6">
        <StockPriceChart stock={stock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* <div className="card">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-primary-600" />
              Key Statistics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Day High
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stock.dayHigh || stock.high || 0)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Day Low
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stock.dayLow || stock.low || 0)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Previous Close
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {formatCurrency(stock.previousClose || 0)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Volume
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {stock.volume ? stock.volume.toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Market Cap
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {stock.marketCap ? formatNumber(stock.marketCap) : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                  Sector
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {stock.sector || 'N/A'}
                </p>
              </div>
            </div>
          </div> */}

          {/* Description */}
          {/* {stock.description && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FiInfo className="w-5 h-5 text-primary-600" />
                About {stock.companyName || stock.name || stock.symbol}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {stock.description}
              </p>
            </div>
          )} */}
        </div>

        <div className="space-y-6">
          {holding && (
            <div className="card border-l-4 border-primary-600">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Your Position
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shares Owned</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {holding.quantity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Avg Buy Price</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(holding.averageBuyPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Current Value</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency((stock.currentPrice || stock.price) * holding.quantity)}
                  </span>
                </div>
                <hr className="dark:border-gray-700" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Total P&L</span>
                  <span
                    className={`font-bold ${
                      holdingPL >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {holdingPL >= 0 ? '+' : ''}
                    {formatCurrency(holdingPL)} ({holdingPL >= 0 ? '+' : ''}
                    {holdingPLPercent}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <BuySellModal
          stock={stock}
          holding={holding}
          onClose={() => setShowModal(false)}
          onSuccess={handleTradeSuccess}
        />
      )}
    </div>
  );
};

export default StockDetailPage;
