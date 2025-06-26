import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const GardenerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isSignUp && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Simulate login/signup
    setTimeout(() => {
      navigate('/gardener/dashboard');
    }, 500);
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
            <span className="ml-2 text-2xl font-bold text-garden">Gardener {isSignUp ? 'Sign Up' : 'Sign In'}</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              className="input-field"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
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
              />
            )}
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            <button type="submit" className="btn-primary w-full mt-2">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
          <div className="text-center mt-4">
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

export default GardenerAuth; 