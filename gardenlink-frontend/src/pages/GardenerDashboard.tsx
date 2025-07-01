import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LogOut, UploadCloud, CreditCard } from 'lucide-react';
import { logout, isAuthenticated, getMyProfile, saveMyProfile } from '../api';

const allServices = [
  'Lawn Mowing',
  'Planting',
  'Garden Design',
  'Maintenance',
];

const DEFAULT_AVATAR = (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300">
    <circle cx="20" cy="20" r="20" fill="#E5E7EB" />
    <ellipse cx="20" cy="15" rx="7" ry="7" fill="#D1D5DB" />
    <ellipse cx="20" cy="30" rx="12" ry="7" fill="#D1D5DB" />
  </svg>
);

type GardenerForm = {
  name: string;
  location: string;
  zip: string;
  age: string;
  price: string;
  email: string;
  services: string[];
  bio: string;
  photo: string;
  isPublished: boolean;
};

const GardenerDashboard = () => {
  const [form, setForm] = useState<GardenerForm>({
    name: '',
    location: '',
    zip: '',
    age: '',
    price: '',
    email: '',
    services: [],
    bio: '',
    photo: '',
    isPublished: false,
  });
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Check authentication and load profile on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/gardener/auth');
      return;
    }
    // Load user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    // Load profile from backend
    const token = localStorage.getItem('token');
    if (token) {
      getMyProfile(token)
        .then(profile => {
          setForm({
            name: profile.name || '',
            location: profile.location || '',
            zip: profile.zip || '',
            age: profile.age?.toString() || '',
            price: profile.price?.toString() || '',
            email: profile.email || '',
            services: profile.services ? profile.services.map((s: any) => s.name) : [],
            bio: profile.bio || '',
            photo: profile.photo || '',
            isPublished: profile.isPublished || false,
          });
        })
        .catch(err => {
          // If profile not found, keep form empty
          if (err.message !== 'Profile not found') setError(err.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleServiceChange = (service: string) => {
    setForm(f => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter(s => s !== service)
        : [...f.services, service],
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setErrorDetails([]);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setUploading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('http://localhost:4000/api/gardeners/profile/photo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload photo');
      // Reload profile after upload to sync form
      const profile = await getMyProfile(token);
      setForm({
        name: profile.name || '',
        location: profile.location || '',
        zip: profile.zip || '',
        age: profile.age?.toString() || '',
        price: profile.price?.toString() || '',
        email: profile.email || '',
        services: profile.services ? profile.services.map((s: any) => s.name) : [],
        bio: profile.bio || '',
        photo: profile.photo || '',
        isPublished: profile.isPublished || false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setErrorDetails([]);
    setSuccess(false);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setSaving(false);
      return;
    }
    try {
      const profileData = {
        ...form,
        age: parseInt(form.age, 10),
        price: parseInt(form.price, 10),
      };
      await saveMyProfile(token, profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      // Show detailed validation errors if available
      if (err.message && err.message.includes('[') && err.message.includes(']')) {
        try {
          const details = JSON.parse(err.message);
          if (Array.isArray(details)) {
            setError('Invalid input:');
            setErrorDetails(details.map((d: any) => `${d.path.join('.')}: ${d.message}`));
            return;
          }
        } catch {}
      }
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/gardener/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garden mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 mr-4">
                {form.photo ? (
                  <img src={form.photo.startsWith('http') ? form.photo : `http://localhost:4000${form.photo}`} alt="Profile" className="w-16 h-16 object-cover" />
                ) : (
                  DEFAULT_AVATAR
                )}
              </div>
              <button
                type="button"
                className="ml-2 flex items-center gap-1 text-sm text-garden hover:underline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <UploadCloud className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
                disabled={uploading}
              />
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/gardener/payments')} 
                className="flex items-center gap-1 text-garden hover:text-garden-dark text-sm font-medium"
              >
                <CreditCard className="w-4 h-4" /> Payments
              </button>
              <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-garden text-sm">
                <LogOut className="w-5 h-5" /> Log out
              </button>
            </div>
          </div>
          {/* User Info Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">Role: {user?.role}</p>
            
            {/* Profile Publishing Status */}
            {form.name && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Status</p>
                    <p className="text-xs text-gray-600">
                      {form.isPublished ? 'Your profile is visible to clients' : 'Your profile is not visible to clients'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    form.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {form.isPublished ? 'Published' : 'Unpublished'}
                  </div>
                </div>
                
                {!form.isPublished && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      <strong>Subscribe to publish your profile!</strong>
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      Clients can only see profiles from gardeners with active subscriptions.
                    </p>
                    <button
                      onClick={() => navigate('/gardener/payments')}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Subscription Plans
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              type="text"
              className="input-field"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={saving}
            />
            <input
              name="location"
              type="text"
              className="input-field"
              placeholder="City, State"
              value={form.location}
              onChange={handleChange}
              required
              disabled={saving}
            />
            <input
              name="zip"
              type="text"
              className="input-field"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={handleChange}
              required
              disabled={saving}
            />
            <input
              name="age"
              type="number"
              className="input-field"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              min={16}
              required
              disabled={saving}
            />
            <input
              name="price"
              type="number"
              className="input-field"
              placeholder="Price per hour ($)"
              value={form.price}
              onChange={handleChange}
              min={0}
              required
              disabled={saving}
            />
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="Contact Email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={saving}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
              <div className="flex flex-wrap gap-3">
                {allServices.map(service => (
                  <label key={service} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="accent-garden"
                      disabled={saving}
                    />
                    <span className="text-gray-700 text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <textarea
              name="bio"
              className="input-field"
              placeholder="Short Bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              required
              disabled={saving}
            />
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
            {errorDetails.length > 0 && (
              <ul className="text-red-600 text-xs text-left max-w-md mx-auto mb-2">
                {errorDetails.map((err, i) => <li key={i}>• {err}</li>)}
              </ul>
            )}
            <button type="submit" className="btn-primary w-full mt-4" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {success && (
              <div className="text-green-600 text-center mt-2">Profile saved!</div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GardenerDashboard; 