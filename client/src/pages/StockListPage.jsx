import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStocks } from '../redux/slices/stockSlice';
import { searchStocks } from '../redux/slices/stockSlice';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/common/Loader';
import {
  FiSearch,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiArrowRight,
} from 'react-icons/fi';

const SECTORS = [
  'All Sectors',
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer',
  'Communication',
  'Industrials',
  'Materials',
  'Real Estate',
  'Utilities',
];

const ITEMS_PER_PAGE = 20;

const StockListPage = () => {
  const dispatch = useDispatch();
  const { list: stocks, searchResults, loading, pagination } = useSelector((state) => state.stocks);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      dispatch(searchStocks(searchQuery));
    }
  }, [dispatch, searchQuery]);

  const filteredStocks = useMemo(() => {
    let result = searchQuery.trim() ? searchResults : stocks;

    if (selectedSector !== 'All Sectors') {
      result = result.filter((stock) => stock.sector === selectedSector);
    }

    return result;
  }, [stocks, searchResults, searchQuery, selectedSector]);

  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);
  const paginatedStocks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStocks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStocks, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSector]);

  const getChangeValue = (stock) => {
    const price = stock.currentPrice || stock.price || 0;
    const prev = stock.previousClose || 0;
    return price - prev;
  };

  const getChangePercent = (stock) => {
    const price = stock.currentPrice || stock.price || 0;
    const prev = stock.previousClose || 0;
    if (prev === 0) return 0;
    return ((price - prev) / prev) * 100;
  };

  if (loading) {
    return <Loader text="Loading stocks..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Stock Market
        </h1>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by symbol or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="input-field sm:w-48"
          >
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Showing {paginatedStocks.length} of {filteredStocks.length} stocks
          {selectedSector !== 'All Sectors' && ` in ${selectedSector}`}
        </p>
      </div>

      {filteredStocks.length === 0 ? (
        <div className="card text-center py-12">
          <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No stocks found.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="card hidden md:block overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750">
                    <th className="px-6 py-3 font-medium">Symbol</th>
                    <th className="px-6 py-3 font-medium">Company Name</th>
                    <th className="px-6 py-3 font-medium text-right">Price</th>
                    <th className="px-6 py-3 font-medium text-right">Change</th>
                    <th className="px-6 py-3 font-medium">Sector</th>
                    <th className="px-6 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {paginatedStocks.map((stock) => {
                    const change = getChangeValue(stock);
                    const changePct = getChangePercent(stock);
                    const isPositive = change >= 0;

                    return (
                      <tr
                        key={stock._id || stock.symbol}
                        className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {stock.symbol}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {stock.name}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(stock.currentPrice || stock.price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'
                              }`}
                          >
                            {isPositive ? (
                              <FiTrendingUp className="w-4 h-4" />
                            ) : (
                              <FiTrendingDown className="w-4 h-4" />
                            )}
                            {isPositive ? '+' : ''}
                            {change.toFixed(2)} ({isPositive ? '+' : ''}
                            {changePct.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {stock.sector}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link
                            to={`/stocks/${stock.symbol}`}
                            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
                          >
                            <FiEye className="w-4 h-4" />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {paginatedStocks.map((stock) => {
              const change = getChangeValue(stock);
              const changePct = getChangePercent(stock);
              const isPositive = change >= 0;

              return (
                <Link
                  key={stock._id || stock.symbol}
                  to={`/stocks/${stock.symbol}`}
                  className="card block hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        {stock.symbol}
                      </span>
                      <span className="ml-2 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {stock.sector}
                      </span>
                    </div>
                    <FiArrowRight className="text-gray-400 w-4 h-4" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                    {stock.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stock.currentPrice || stock.price)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'
                        }`}
                    >
                      {isPositive ? (
                        <FiTrendingUp className="w-4 h-4" />
                      ) : (
                        <FiTrendingDown className="w-4 h-4" />
                      )}
                      {isPositive ? '+' : ''}
                      {changePct.toFixed(2)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {(() => {
                const pages = [];
                const maxVisible = 5;
                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let end = Math.min(totalPages, start + maxVisible - 1);

                if (end - start + 1 < maxVisible) {
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="w-9 h-9 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      1
                    </button>
                  );
                  if (start > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                }

                for (let i = start; i <= end; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${currentPage === i
                          ? 'bg-primary-600 text-white border border-primary-600'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-1 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-9 h-9 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockListPage;
