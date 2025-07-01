import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Search, Users, Star, Shield, Clock, DollarSign, Mail, Phone } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Free Search',
      description: 'Search and browse gardener profiles completely free. No account required.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Verified Professionals',
      description: 'All gardeners are verified and pay subscription fees for quality assurance.'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Real Reviews',
      description: 'Read verified reviews from homeowners who have worked with these gardeners.'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Direct Contact',
      description: 'Contact gardeners directly via email or phone. No platform fees or booking charges.'
    }
  ];

  const gardenerBenefits = [
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
      title: 'Flexible Plans',
      description: 'Choose from Basic ($29), Premium ($59), or Featured ($99) monthly plans.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Active Gardeners' },
    { number: '2,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '4.8', label: 'Average Rating' }
  ];

  const subscriptionPlans = [
    {
      name: 'Basic Plan',
      price: '$29',
      features: ['Appear in search results', 'Basic profile', 'Email contact', 'Review system'],
      popular: false
    },
    {
      name: 'Premium Plan',
      price: '$59',
      features: ['Priority placement', 'Enhanced profile', 'Phone contact', 'Featured listing'],
      popular: true
    },
    {
      name: 'Featured Plan',
      price: '$99',
      features: ['Top placement', 'Full profile', 'All contact methods', 'Analytics dashboard'],
      popular: false
    }
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
                Find Local Garden
                <span className="block">Professionals</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Connect directly with verified gardeners in your area. 
                <span className="font-semibold"> Free for homeowners, subscription-based for gardeners.</span>
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
                Search Gardeners (Free)
              </Link>
              <Link
                to="/gardener/auth"
                className="bg-garden-dark text-white hover:bg-garden-darker font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Join as Gardener
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

      {/* How It Works for Homeowners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works for Homeowners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, free, and direct connection with local gardeners
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
                Search for gardeners by location, services, and price. Browse profiles, photos, and reviews.
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
                Contact gardeners directly via email or phone. No platform fees or booking charges.
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
                Arrange work directly with the gardener. Pay them directly - no platform fees.
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
              Why Choose GardenLink?
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

      {/* For Gardeners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              For Garden Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get more leads and grow your business with our subscription-based platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {gardenerBenefits.map((benefit, index) => (
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscription Plans</h3>
            <p className="text-gray-600">Choose the plan that fits your business needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative border-2 rounded-lg p-6 ${
                  plan.popular ? 'border-garden bg-garden-light' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-garden text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-garden mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                  <p className="text-gray-600 text-sm">per month</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-garden rounded-full flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/gardener/auth"
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-garden text-white hover:bg-garden-dark'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
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
              Join thousands of homeowners and gardeners who trust GardenLink for their garden care needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="bg-white text-garden hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Search Gardeners (Free)
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