import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { signup, login, checkBackendHealth } from '../api';

const YardWorkerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const navigate = useNavigate();

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };
    checkHealth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (isSignUp && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Check password length for signup
    if (isSignUp && form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      let data;
      if (isSignUp) {
        data = await signup(form.email, form.password);
      } else {
        data = await login(form.email, form.password);
      }
      
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard
      navigate('/yardworker/dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 bg-garden rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="ml-2 text-2xl font-bold text-garden">Yard Worker {isSignUp ? 'Sign Up' : 'Sign In'}</span>
          </div>
          
          {/* Backend Status Indicator */}
          {backendStatus === 'checking' && (
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm text-center">
              Checking backend connection...
            </div>
          )}
          {backendStatus === 'offline' && (
            <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm text-center">
              ⚠️ Backend server is not running. Please start the backend server.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading || backendStatus === 'offline'}
            />
            <input
              name="password"
              type="password"
              className="input-field"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading || backendStatus === 'offline'}
            />
            {isSignUp && (
              <input
                name="confirmPassword"
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading || backendStatus === 'offline'}
              />
            )}
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            <button 
              type="submit" 
              className="btn-primary w-full mt-2"
              disabled={loading || backendStatus === 'offline'}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>
          
          <div className="text-center mt-6">
            {isSignUp ? (
              <span className="text-sm text-gray-600">Already have an account?{' '}
                <button className="text-garden font-medium hover:underline" onClick={() => setIsSignUp(false)}>Sign In</button>
              </span>
            ) : (
              <span className="text-sm text-gray-600">Don't have an account?{' '}
                <button className="text-garden font-medium hover:underline" onClick={() => setIsSignUp(true)}>Sign Up</button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YardWorkerAuth; 