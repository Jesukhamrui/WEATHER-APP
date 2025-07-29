import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="flex items-center justify-between flex-wrap gap-4 p-4 border-b border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-white dark:bg-gray-800">
          <img src="/logo.png" alt="Weather App Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Weathery 🌤️</h1>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <a href="https://linkedin.com" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://github.com" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://behance.net" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-behance"></i>
          </a>
          <a href="https://facebook.com" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://instagram.com" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-blue-500 hover:text-white transition"
        >
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;