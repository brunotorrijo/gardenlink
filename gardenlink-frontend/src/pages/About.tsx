import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
    <div className="max-w-2xl w-full mx-auto card">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 bg-garden rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-garden mb-4">About GardenLink</h1>
        <p className="text-lg text-gray-700 mb-6">
          GardenLink is your trusted platform for connecting homeowners with local, reliable lawn care and gardening professionals. Whether you need regular lawn mowing, garden design, planting, or maintenance, our mission is to make it easy for you to find the right expert for your outdoor space.
        </p>
        <div className="bg-garden text-white rounded-lg p-4 mb-6 font-medium">
          Find local lawn care and gardening professionals in seconds.<br/>
          No sign-up required — just explore, compare, and connect directly with the right expert for your garden.<br/>
          Simple, fast, and made for you.
        </div>
        <p className="text-gray-600">
          Browse gardener profiles, filter by location, price, and services, and contact your chosen professional directly. GardenLink is designed for simplicity and transparency — no hidden fees, no middlemen, just great gardens.
        </p>
      </motion.div>
    </div>
  </div>
);

export default About; 