import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Search, Users, Star, Shield, Clock } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Easy Search',
      description: 'Find local gardeners based on location, services, and reviews.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Verified Professionals',
      description: 'All gardeners are verified and background-checked for your safety.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Quality Guaranteed',
      description: 'Read reviews and ratings from other homeowners before hiring.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Platform',
      description: 'Safe and secure way to connect with trusted garden professionals.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Gardeners' },
    { number: '2,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-garden-light to-garden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="w-8 h-8 text-garden" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Connect with Local
                <span className="block">Garden Professionals</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Find trusted gardeners in your area for all your lawn care and gardening needs. 
                Simple, secure, and reliable.
              </p>
            </motion.div>

            {/* Main Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/search"
                className="bg-white text-garden hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                I Need a Gardener
              </Link>
              <Link
                to="/gardener/auth"
                className="bg-garden-dark text-white hover:bg-garden-darker font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                I'm a Gardener
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose GardenLink?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find the perfect gardener for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-garden-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-garden">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started with GardenLink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-garden rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Search & Browse
              </h3>
              <p className="text-gray-600">
                Search for gardeners in your area and browse their profiles, services, and reviews.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-garden rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Contact & Connect
              </h3>
              <p className="text-gray-600">
                Reach out to gardeners directly through our secure messaging system.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-garden rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Your Garden Done
              </h3>
              <p className="text-gray-600">
                Arrange the work, pay securely, and enjoy your beautiful garden.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-garden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of homeowners who trust GardenLink for their garden care needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-garden hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Find a Gardener
              </Link>
              <Link
                to="/gardener/auth"
                className="bg-garden-dark text-white hover:bg-garden-darker font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Join as Gardener
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 