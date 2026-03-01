import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiTrendingUp,
  FiPieChart,
  FiAward,
  FiArrowRight,
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";


const features = [
  {
    icon: FaRupeeSign,
    title: 'Virtual ₹100K',
    description:
      'Start with ₹100,000 in virtual cash. ',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: FiTrendingUp,
    title: 'Real-time Prices',
    description:
      'Trade with live market data.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: FiPieChart,
    title: 'Portfolio Tracking',
    description:
      'Monitor your holdings, track gains.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: FiAward,
    title: 'Leaderboard',
    description:
      'Compete with other traders.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
];

const steps = [
  {
    number: '01',
    title: 'Register',
    description:
      'Create your free account in seconds and receive ₹100,000 in virtual cash to start your trading journey.',
  },
  {
    number: '02',
    title: 'Browse Stocks',
    description:
      'Explore real stocks from major exchanges. Research companies with live prices and market data.',
  },
  {
    number: '03',
    title: 'Start Trading',
    description:
      'Buy and sell stocks with your virtual balance. Build your portfolio, track performance, and learn by doing.',
  },
];

const LandingPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-32 lg:py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Practice Trading
              <br />
              <span className="text-primary-200">Without the Risk</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Master the stock market with ₹100,000 in virtual cash. Trade real
              stocks.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg shadow-primary-900/30"
                >
                  Go to Dashboard
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg shadow-primary-900/30"
                  >
                    Get Started
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              SB Stocks gives you all the tools to practice trading in a
              realistic, risk-free environment.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bg} ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {!user && (
        <section className="py-20 sm:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Ready to Start Your Trading Journey?
            </h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Join SB Stocks today and get ₹100,000 in virtual cash. No credit
              card required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
              >
                Create Account
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
