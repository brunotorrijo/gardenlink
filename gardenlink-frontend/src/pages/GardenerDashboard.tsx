import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, LogOut } from 'lucide-react';

const allServices = [
  'Lawn Mowing',
  'Planting',
  'Garden Design',
  'Maintenance',
];

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
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleLogout = () => {
    navigate('/gardener/auth');
  };

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
              <div className="w-10 h-10 bg-garden rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="ml-2 text-2xl font-bold text-garden">Your Gardener Profile</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-garden text-sm">
              <LogOut className="w-5 h-5" /> Log out
            </button>
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
            />
            <input
              name="location"
              type="text"
              className="input-field"
              placeholder="City, State"
              value={form.location}
              onChange={handleChange}
              required
            />
            <input
              name="zip"
              type="text"
              className="input-field"
              placeholder="ZIP Code"
              value={form.zip}
              onChange={handleChange}
              required
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
            />
            <input
              name="email"
              type="email"
              className="input-field"
              placeholder="Contact Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
              <div className="flex flex-wrap gap-3">
                {allServices.map(service => (
                  <label key={service} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.services.includes(service)}
                      onChange={() => handleServiceChange(service)}
                      className="accent-garden"
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
            />
            <input
              name="photo"
              type="url"
              className="input-field"
              placeholder="Profile Photo URL"
              value={form.photo}
              onChange={handleChange}
            />
            <button type="submit" className="btn-primary w-full mt-4">Save Profile</button>
            {success && (
              <div className="text-green-600 text-center mt-2">Profile saved! (Not really, this is a demo.)</div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default GardenerDashboard; 