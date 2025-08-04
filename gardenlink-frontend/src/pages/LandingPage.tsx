import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Search, Users, Star, Shield, Clock, DollarSign, Mail } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Free Search',
      description: 'Search and browse yard worker profiles completely free. No account required.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Verified Professionals',
      description: 'All yard workers are verified and pay subscription fees for quality assurance.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Real Reviews',
      description: 'Read verified reviews from homeowners who have worked with these yard workers.'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Direct Contact',
      description: 'Contact yard workers directly via email or phone. No platform fees or booking charges.'
    }
  ];

  const yardWorkerBenefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Lead Generation',
      description: 'Get qualified leads from homeowners actively looking for garden services.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Professional Profile',
      description: 'Showcase your services, photos, and reviews to attract more clients.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Build Reputation',
      description: 'Collect and display reviews to build trust with potential clients.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Simple Pricing',
      description: 'One straightforward plan at $10/month to get you started.'
    }
  ];

  const subscriptionPlan = {
    name: 'YardConnect Subscription',
    price: '$10',
    features: [
      'Appear in search results',
      'Complete profile with photo',
      'Contact information displayed',
      'Review system access',
      'Direct client contact'
    ]
  };

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
                Find Local Yard
                <span className="block">Workers</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect directly with verified yard workers in your area. 
                <span className="font-semibold"> Free for homeowners, subscription-based for yard workers.</span>
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
                Search Yard Workers (Free)
              </Link>
              <Link
                to="/yard-worker/auth"
                className="bg-garden-dark text-white hover:bg-garden-darker font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Join as Yard Worker
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works for Homeowners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works for Homeowners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, free, and direct connection with local yard workers
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
                Search for yard workers by location, services, and price. Browse profiles, photos, and reviews.
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
                Contact Directly
              </h3>
              <p className="text-gray-600">
                Contact yard workers directly via email or phone. No platform fees or booking charges.
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
                Work & Pay Directly
              </h3>
              <p className="text-gray-600">
                Arrange work directly with the yard worker. Pay them directly - no platform fees.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features for Homeowners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose YardConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The smart way to find and connect with local garden professionals
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

      {/* For Yard Workers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Yard Workers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get more leads and grow your business with our subscription-based platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {yardWorkerBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-garden-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-garden">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Subscription Plans */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your YardConnect Journey</h3>
            <p className="text-gray-600">Join our platform and start getting clients today</p>
          </div>

          <div className="max-w-lg mx-auto">
            <motion.div
              key="subscription-plan"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative border-2 rounded-xl p-8 border-garden bg-gradient-to-br from-garden-light to-white shadow-lg"
            >
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-garden mb-2">{subscriptionPlan.name}</h4>
                <div className="text-4xl font-bold text-gray-900 mb-1">{subscriptionPlan.price}</div>
                <p className="text-gray-600 text-sm">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                {subscriptionPlan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-garden rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/yard-worker/auth"
                className="w-full py-3 px-6 rounded-lg font-semibold transition-colors bg-garden text-white hover:bg-garden-dark transform hover:scale-105"
              >
                Get Started Today
              </Link>
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
              Join YardConnect today and start connecting homeowners with reliable yard workers in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-garden hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Search Yard Workers (Free)
              </Link>
              <Link
                to="/yard-worker/auth"
                className="bg-garden-dark text-white hover:bg-garden-darker font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Join as Yard Worker
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 