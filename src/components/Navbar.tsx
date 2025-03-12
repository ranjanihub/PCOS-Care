import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">PCOS Care</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2">Home</Link>
            <Link to="/consultation" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Start Consultation
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;