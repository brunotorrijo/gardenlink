import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  stripePriceId: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

const PaymentDashboard = () => {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Fetch plan and subscription in parallel
      const [planRes, subscriptionRes] = await Promise.all([
        fetch('https://yardconnect-backend.onrender.com/api/payments/plans'),
        fetch('https://yardconnect-backend.onrender.com/api/payments/subscription', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const planData = await planRes.json();
      const subscriptionData = await subscriptionRes.json();

      setPlan(planData.subscription);
      setSubscription(subscriptionData.status === 'none' ? null : subscriptionData);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setProcessing(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const res = await fetch('https://yardconnect-backend.onrender.com/api/payments/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: 'subscription' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create subscription');

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      setProcessing(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const res = await fetch('https://yardconnect-backend.onrender.com/api/payments/subscription', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscriptionId: subscription.id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel subscription');

      // Refresh subscription data
      await fetchSubscriptionData();
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'expired': return 'text-orange-600';
      case 'trial': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-garden"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-bold text-garden mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Status
        </h2>
        
        {subscription ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{plan?.name || subscription.plan}</h3>
                <p className={`text-sm font-medium ${getStatusColor(subscription.status)}`}>
                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-garden">{formatPrice(subscription.amount)}</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Started</p>
                <p className="font-medium">{formatDate(subscription.startDate)}</p>
              </div>
              <div>
                <p className="text-gray-600">Next billing</p>
                <p className="font-medium">{formatDate(subscription.endDate)}</p>
              </div>
            </div>

            {subscription.status === 'active' && (
              <button
                onClick={handleCancelSubscription}
                disabled={processing}
                className="btn-secondary text-sm"
              >
                {processing ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to appear in search results and get more leads.
            </p>
          </div>
        )}
      </motion.div>

      {/* Subscription Plan */}
      {!subscription && plan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-garden mb-6">Subscribe to YardConnect</h2>
          
          <div className="max-w-md mx-auto">
            <div className="border-2 border-garden rounded-lg p-6 bg-garden-light">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-garden mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(plan.price)}
                </div>
                <p className="text-gray-600 text-sm">per month</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full py-2 px-4 rounded-lg font-medium bg-garden text-white hover:bg-garden-dark transition-colors"
              >
                {processing ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment History */}
      {subscription && subscription.payments && subscription.payments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-bold text-garden mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Payment History
          </h2>
          
          <div className="space-y-3">
            {subscription.payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    payment.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{formatPrice(payment.amount)}</p>
                    <p className="text-sm text-gray-600">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  payment.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {error && (
        <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard; 