import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-6 w-6 text-purple-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">PCOS Care</span>
          </div>
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} PCOS Care. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;