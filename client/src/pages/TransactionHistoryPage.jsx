import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../redux/slices/transactionSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import Loader from '../components/common/Loader';

const FILTER_TABS = [
  { label: 'All', value: '' },
  { label: 'Buy Only', value: 'BUY' },
  { label: 'Sell Only', value: 'SELL' },
];

const TransactionHistoryPage = () => {
  const dispatch = useDispatch();
  const { list: transactions, pagination, historyLoading } = useSelector(
    (state) => state.transactions
  );
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page,
        limit: 15,
        type: filterType || undefined,
      })
    );
  }, [dispatch, page, filterType]);

  const handleFilterChange = (value) => {
    setFilterType(value);
    setPage(1);
  };

  const totalPages = pagination.pages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
      </div>
      <div className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleFilterChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterType === tab.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {historyLoading ? (
        <Loader text="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No transactions yet. Start trading!
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price/Share
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Balance After
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      P&L
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {formatDateTime(tx.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            tx.type === 'BUY'
                              ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                              : 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {tx.stock?.symbol || tx.symbol || '---'}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 text-right">
                        {tx.quantity}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300 text-right whitespace-nowrap">
                        {formatCurrency(tx.pricePerShare)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white text-right whitespace-nowrap">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">
                        {tx.balanceAfter != null ? formatCurrency(tx.balanceAfter) : '---'}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-right whitespace-nowrap">
                        {tx.type === 'SELL' && tx.profitLoss != null ? (
                          <span
                            className={
                              tx.profitLoss >= 0
                                ? 'text-success-600 dark:text-success-400'
                                : 'text-danger-600 dark:text-danger-400'
                            }
                          >
                            {tx.profitLoss >= 0 ? '+' : ''}
                            {formatCurrency(tx.profitLoss)}
                          </span>
                        ) : (
                          <span className="text-gray-400">---</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:hidden space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      tx.type === 'BUY'
                        ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                        : 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400'
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDateTime(tx.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    {tx.stock?.symbol || tx.symbol || '---'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {tx.quantity} share{tx.quantity !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Price/Share</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {formatCurrency(tx.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(tx.totalAmount)}
                    </span>
                  </div>
                  {tx.balanceAfter != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Balance After</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {formatCurrency(tx.balanceAfter)}
                      </span>
                    </div>
                  )}
                  {tx.type === 'SELL' && tx.profitLoss != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">P&L</span>
                      <span
                        className={`font-semibold ${
                          tx.profitLoss >= 0
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-danger-600 dark:text-danger-400'
                        }`}
                      >
                        {tx.profitLoss >= 0 ? '+' : ''}
                        {formatCurrency(tx.profitLoss)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-5 py-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default TransactionHistoryPage;
