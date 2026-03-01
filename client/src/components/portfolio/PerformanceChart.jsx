import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'];

const PerformanceChart = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No holdings to display
      </div>
    );
  }

  const data = {
    labels: holdings.map((h) => h.stock.symbol),
    datasets: [
      {
        data: holdings.map((h) => h.currentValue),
        backgroundColor: COLORS.slice(0, holdings.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 15, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="h-72">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PerformanceChart;
