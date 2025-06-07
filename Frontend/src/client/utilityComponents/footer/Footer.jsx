import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2 tracking-wide">AMS</h2>
          <p className="text-sm text-blue-200 leading-relaxed">
            Attendance Management System designed for modern schools and colleges to streamline daily attendance tracking.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-blue-100 hover:text-white transition duration-200">Home</a>
            </li>
            <li>
              <a href="/login" className="text-blue-100 hover:text-white transition duration-200">Login</a>
            </li>
            <li>
              <a href="/register" className="text-blue-100 hover:text-white transition duration-200">Register</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-blue-200">📧 Email: <a href="mailto:support@ams.com" className="hover:underline">support@ams.com</a></p>
          <p className="text-sm text-blue-200 mt-1">📞 Phone: <a href="tel:+911234567890" className="hover:underline">+91 12345 67890</a></p>
        </div>
      </div>

      <div className="text-center text-blue-200 text-sm mt-10 border-t border-blue-500 pt-4">
        © {new Date().getFullYear()} <span className="font-semibold">AMS</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;