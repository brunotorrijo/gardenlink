import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-garden rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GardenLink</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Connecting homeowners with trusted local gardeners. Find the perfect match for your garden care needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-garden transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-garden transition-colors">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-garden transition-colors">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-garden transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-garden transition-colors">
                  Find Gardeners
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-garden transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-garden transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-garden transition-colors">
                  Lawn Mowing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-garden transition-colors">
                  Garden Design
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-garden transition-colors">
                  Planting
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-garden transition-colors">
                  Maintenance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 GardenLink. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-garden text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-garden text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 