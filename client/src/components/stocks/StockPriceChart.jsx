import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const TIMEFRAMES = [
  { label: '1D', days: 1, points: 24 },
  { label: '5D', days: 5, points: 40 },
  { label: '1M', days: 30, points: 30 },
  { label: '1Y', days: 365, points: 52 },
  { label: '5Y', days: 1825, points: 60 },
];

const generatePriceData = (currentPrice, previousClose, days, points) => {
  const prices = [];
  const labels = [];
  const now = new Date();

  // Work backwards from current price
  const volatility = currentPrice * 0.015; // 1.5% daily volatility
  let price = currentPrice;

  // Generate prices in reverse (from now to past)
  const reversedPrices = [price];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.48) * volatility * (days > 30 ? 1.5 : 1);
    price = price - change;
    price = Math.max(price * 0.7, Math.min(price * 1.3, price)); // clamp
    reversedPrices.push(price);
  }

  // Reverse so oldest is first
  reversedPrices.reverse();

  for (let i = 0; i < points; i++) {
    prices.push(parseFloat(reversedPrices[i].toFixed(2)));

    const date = new Date(now);
    if (days === 1) {
      // Intraday: hourly labels
      date.setHours(date.getHours() - (points - 1 - i));
      labels.push(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else if (days <= 5) {
      // 5-day: show day + time
      date.setHours(date.getHours() - (points - 1 - i) * 3);
      labels.push(date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }));
    } else if (days <= 30) {
      // 1 month: daily
      date.setDate(date.getDate() - (points - 1 - i));
      labels.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    } else if (days <= 365) {
      // 1 year: weekly
      date.setDate(date.getDate() - (points - 1 - i) * 7);
      labels.push(date.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    } else {
      // 5 years: monthly
      date.setMonth(date.getMonth() - (points - 1 - i));
      labels.push(date.toLocaleDateString([], { month: 'short', year: '2-digit' }));
    }
  }

  return { prices, labels };
};

const StockPriceChart = ({ stock }) => {
  const [activeTimeframe, setActiveTimeframe] = useState('1M');

  const tf = TIMEFRAMES.find((t) => t.label === activeTimeframe);

  const { prices, labels } = useMemo(
    () => generatePriceData(stock.currentPrice, stock.previousClose, tf.days, tf.points),
    [stock.currentPrice, stock.previousClose, tf.days, tf.points]
  );

  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const isUp = lastPrice >= firstPrice;
  const lineColor = isUp ? '#22c55e' : '#ef4444';
  const bgColor = isUp ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';

  const data = {
    labels,
    datasets: [
      {
        label: stock.symbol,
        data: prices,
        borderColor: lineColor,
        backgroundColor: bgColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17,24,39,0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#f3f4f6',
        borderColor: 'rgba(75,85,99,0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (ctx) => ctx[0].label,
          label: (ctx) => {
            const price = ctx.parsed.y;
            const change = price - firstPrice;
            const changePct = ((change / firstPrice) * 100).toFixed(2);
            return [
              `Price: ${formatCurrency(price)}`,
              `Change: ${change >= 0 ? '+' : ''}${formatCurrency(change)} (${change >= 0 ? '+' : ''}${changePct}%)`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: {
          maxTicksLimit: 6,
          color: '#9ca3af',
          font: { size: 11 },
        },
        border: { display: false },
      },
      y: {
        display: true,
        position: 'right',
        grid: { color: 'rgba(156,163,175,0.1)' },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: (val) => formatCurrency(val),
        },
        border: { display: false },
      },
    },
  };

  const priceChange = lastPrice - firstPrice;
  const priceChangePct = ((priceChange / firstPrice) * 100).toFixed(2);

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Price Chart
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(lastPrice)}
            </span>
            <span className={`text-sm font-semibold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{formatCurrency(priceChange)} ({priceChange >= 0 ? '+' : ''}{priceChangePct}%)
            </span>
          </div>
        </div>

        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {TIMEFRAMES.map((t) => (
            <button
              key={t.label}
              onClick={() => setActiveTimeframe(t.label)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTimeframe === t.label
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 sm:h-80">
        <Line data={data} options={options} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span>Previous Close: {formatCurrency(stock.previousClose)}</span>
        <span>Vol: {stock.volume ? stock.volume.toLocaleString() : 'N/A'}</span>
      </div>
    </div>
  );
};

export default StockPriceChart;
