import { motion } from 'framer-motion';

const ClientAuth = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Client Authentication</h1>
        <p className="text-gray-600">This page is coming soon...</p>
      </motion.div>
    </div>
  );
};

export default ClientAuth; 