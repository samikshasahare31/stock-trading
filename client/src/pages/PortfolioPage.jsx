import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPortfolio, fetchPortfolioSummary } from '../redux/slices/portfolioSlice';
import PerformanceChart from '../components/portfolio/PerformanceChart';
import BuySellModal from '../components/stocks/BuySellModal';
import Loader from '../components/common/Loader';
import { formatCurrency, formatPercent } from '../utils/formatCurrency';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiActivity,
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";

const PortfolioPage = () => {
  const dispatch = useDispatch();
  const { holdings, summary, loading } = useSelector((state) => state.portfolio);

  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioSummary());
  }, [dispatch]);

  const handleTrade = (holding) => {
    setSelectedStock(holding.stock);
    setSelectedHolding(holding);
    setShowModal(true);
  };

  const handleTradeSuccess = () => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioSummary());
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setSelectedHolding(null);
  };

  if (loading) {
    return <Loader text="Loading portfolio..." />;
  }

  const isOverallPositive = summary?.totalProfitLoss >= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          Portfolio
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="flex items-center gap-2 mb-2">
            <FaRupeeSign className="w-5 h-5 text-primary-200" />
            <p className="text-sm font-medium text-primary-100">Portfolio Value</p>
          </div>
          <p className="text-2xl font-extrabold">
            {formatCurrency(summary?.totalPortfolioValue)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <FaRupeeSign className="w-5 h-5 text-blue-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cash Balance</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {formatCurrency(summary?.virtualBalance)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <FiActivity className="w-5 h-5 text-purple-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Invested</p>
          </div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {formatCurrency(summary?.totalInvested)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            {isOverallPositive ? (
              <FiTrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <FiTrendingDown className="w-5 h-5 text-red-500" />
            )}
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</p>
          </div>
          <p
            className={`text-2xl font-extrabold ${isOverallPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
              }`}
          >
            {summary?.totalProfitLoss >= 0 ? '+' : ''}
            {formatCurrency(summary?.totalProfitLoss)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <FiPieChart className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Return</p>
          </div>
          <p
            className={`text-2xl font-extrabold ${summary?.overallReturn >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
              }`}
          >
            {formatPercent(summary?.overallReturn || 0)}
          </p>
        </div>
      </div>

      {holdings && holdings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiPieChart className="w-5 h-5 text-primary-600" />
                Allocation
              </h2>
              <PerformanceChart holdings={holdings} />
            </div>

            <div className="lg:col-span-2 card">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Portfolio Breakdown
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Holdings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {summary?.holdingsCount || holdings.length}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Current Value
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(summary?.totalCurrentValue)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Cash
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(summary?.virtualBalance)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Invested
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(summary?.totalInvested)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Unrealized P&L
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${summary?.totalProfitLoss >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                      }`}
                  >
                    {summary?.totalProfitLoss >= 0 ? '+' : ''}
                    {formatCurrency(summary?.totalProfitLoss)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                    Return
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${summary?.overallReturn >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                      }`}
                  >
                    {formatPercent(summary?.overallReturn || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Holdings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                      Stock
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                      Qty
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider hidden sm:table-cell">
                      Avg Buy Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                      Current Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider hidden md:table-cell">
                      Current Value
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                      P&L
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider hidden lg:table-cell">
                      P&L %
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {holdings.map((h) => {
                    const currentPrice = h.stock?.currentPrice || h.currentPrice || 0;
                    const avgPrice = h.averageBuyPrice || 0;
                    const qty = h.quantity || 0;
                    const currentValue = currentPrice * qty;
                    const pl = (currentPrice - avgPrice) * qty;
                    const plPercent =
                      avgPrice > 0
                        ? ((currentPrice - avgPrice) / avgPrice) * 100
                        : 0;
                    const plPositive = pl >= 0;

                    return (
                      <tr
                        key={h.stock?._id || h._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {h.stock?.symbol || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">
                              {h.stock?.companyName || h.stock?.name || ''}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          {qty}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                          {formatCurrency(avgPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(currentPrice)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-300 hidden md:table-cell">
                          {formatCurrency(currentValue)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-bold ${plPositive
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                          {plPositive ? '+' : ''}
                          {formatCurrency(pl)}
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold hidden lg:table-cell ${plPositive
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                            }`}
                        >
                          {formatPercent(plPercent)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleTrade(h)}
                            className="inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors"
                          >
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-16">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No holdings yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            No holdings yet. Start trading! Browse stocks and place your first trade to build your portfolio.
          </p>
        </div>
      )}
      {showModal && selectedStock && (
        <BuySellModal
          stock={selectedStock}
          holding={selectedHolding}
          onClose={handleCloseModal}
          onSuccess={handleTradeSuccess}
        />
      )}
    </div>
  );
};

export default PortfolioPage;
