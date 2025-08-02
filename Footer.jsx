import React from 'react';

const Footer = () => {
  return (
    <footer className="footer transition-all duration-300">
      <div className="footer-content max-w-2xl mx-auto">
        <div className="footer-links mb-2">
          <a href="#privacy" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors duration-300">Privacy Policy</a>
          <a href="#about" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors duration-300">About Us</a>
          <a href="#terms" className="text-blue-500 hover:text-blue-700 mx-2 transition-colors duration-300">Terms of Service</a>
        </div>
        <div className="footer-contact mb-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Contact us: <a href="mailto:jesukhamrui@gmail.com" className="text-blue-500 hover:text-blue-700 transition-colors duration-300">jesukhamrui@gmail.com</a>
        </div>
        <div className="footer-copyright text-gray-600 dark:text-gray-400 transition-colors duration-300">
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
