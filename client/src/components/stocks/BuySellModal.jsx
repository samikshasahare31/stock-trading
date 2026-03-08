import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyStock, sellStock } from '../../redux/slices/transactionSlice';
import { updateBalance } from '../../redux/slices/authSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const BuySellModal = ({ stock, holding, onClose, onSuccess }) => {
  const [mode, setMode] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tradeLoading } = useSelector((state) => state.transactions);

  if (!stock || !stock._id) return null;

  const price = stock.currentPrice || stock.price || 0;
  const totalAmount = price * quantity;
  const canAfford = user.virtualBalance >= totalAmount;
  const canSell = holding && holding.quantity >= quantity;

  const handleTrade = async () => {
    if (quantity <= 0) return toast.error('Quantity must be positive');
    if (mode === 'BUY' && !canAfford) return toast.error('Insufficient balance');
    if (mode === 'SELL' && !canSell) return toast.error('Insufficient shares');

    try {
      const action = mode === 'BUY' ? buyStock : sellStock;
      const result = await dispatch(action({ stockId: stock._id, quantity })).unwrap();
      dispatch(updateBalance(result.newBalance));
      toast.success(`${mode === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock.symbol}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err || 'Trade failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold dark:text-white">Trade {stock.symbol}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex m-5 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setMode('BUY')}
            className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all ${
              mode === 'BUY' ? 'bg-success-600 text-white shadow' : 'text-gray-500'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setMode('SELL')}
            className={`flex-1 py-2 rounded-md font-semibold text-sm transition-all ${
              mode === 'SELL' ? 'bg-danger-600 text-white shadow' : 'text-gray-500'
            }`}
          >
            SELL
          </button>
        </div>

        <div className="px-5 space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
            <p className="text-2xl font-bold dark:text-white">{formatCurrency(stock.currentPrice)}</p>
          </div>

          <div>
            <label className="label">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-field"
            />
            {mode === 'SELL' && holding && (
              <p className="text-xs text-gray-400 mt-1">Available: {holding.quantity} shares</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price per share</span>
              <span className="dark:text-gray-300">{formatCurrency(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Quantity</span>
              <span className="dark:text-gray-300">{quantity}</span>
            </div>
            <hr className="dark:border-gray-600" />
            <div className="flex justify-between font-bold">
              <span className="dark:text-white">Total {mode === 'BUY' ? 'Cost' : 'Revenue'}</span>
              <span className={mode === 'BUY' ? 'text-danger-600' : 'text-success-600'}>
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Balance: {formatCurrency(user.virtualBalance)}
          </p>
        </div>

        <div className="p-5">
          <button
            onClick={handleTrade}
            disabled={tradeLoading || (mode === 'BUY' && !canAfford) || (mode === 'SELL' && !canSell)}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              mode === 'BUY'
                ? 'bg-success-600 hover:bg-success-700 disabled:bg-gray-400'
                : 'bg-danger-600 hover:bg-danger-700 disabled:bg-gray-400'
            } disabled:cursor-not-allowed`}
          >
            {tradeLoading ? 'Processing...' : `${mode} ${quantity} Share${quantity > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellModal;
