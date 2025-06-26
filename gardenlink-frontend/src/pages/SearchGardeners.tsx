import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeDollarSign, Leaf } from 'lucide-react';

const mockGardeners = [
  {
    id: '1',
    name: 'Alex Green',
    location: 'Austin, TX',
    zip: '78701',
    age: 28,
    price: 35,
    rating: 4.9,
    services: ['Lawn Mowing', 'Planting', 'Garden Design'],
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Experienced gardener with a passion for sustainable landscapes.'
  },
  {
    id: '2',
    name: 'Maria Flores',
    location: 'Dallas, TX',
    zip: '75201',
    age: 34,
    price: 40,
    rating: 4.7,
    services: ['Lawn Mowing', 'Maintenance'],
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Lawn care specialist with 10+ years of experience.'
  },
  {
    id: '3',
    name: 'Sam Patel',
    location: 'Houston, TX',
    zip: '77002',
    age: 25,
    price: 30,
    rating: 4.8,
    services: ['Planting', 'Garden Design'],
    photo: 'https://randomuser.me/api/portraits/men/65.jpg',
    bio: 'Creative garden designer and plant lover.'
  },
  {
    id: '4',
    name: 'Linda Brown',
    location: 'San Antonio, TX',
    zip: '78205',
    age: 41,
    price: 45,
    rating: 5.0,
    services: ['Lawn Mowing', 'Maintenance', 'Planting'],
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Reliable and friendly gardener for all your needs.'
  },
];

const allServices = [
  'Lawn Mowing',
  'Planting',
  'Garden Design',
  'Maintenance',
];

const SearchGardeners = () => {
  const [filters, setFilters] = useState({
    location: '',
    zip: '',
    minPrice: '',
    maxPrice: '',
    service: '',
    minRating: '',
  });

  const filteredGardeners = mockGardeners.filter(g => {
    if (filters.location && !g.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.zip && !g.zip.startsWith(filters.zip)) return false;
    if (filters.minPrice && g.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && g.price > Number(filters.maxPrice)) return false;
    if (filters.service && !g.services.includes(filters.service)) return false;
    if (filters.minRating && g.rating < Number(filters.minRating)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-garden mb-8 text-center flex items-center justify-center gap-2">
          <Leaf className="w-7 h-7 text-garden" /> Find a Gardener
        </h1>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10 flex flex-wrap gap-4 items-end justify-center">
          <input
            type="text"
            placeholder="City or Location"
            className="input-field max-w-xs"
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
          />
          <input
            type="text"
            placeholder="ZIP Code"
            className="input-field max-w-xs"
            value={filters.zip}
            onChange={e => setFilters(f => ({ ...f, zip: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Min Price ($)"
            className="input-field max-w-xs"
            value={filters.minPrice}
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Max Price ($)"
            className="input-field max-w-xs"
            value={filters.maxPrice}
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          />
          <select
            className="input-field max-w-xs"
            value={filters.service}
            onChange={e => setFilters(f => ({ ...f, service: e.target.value }))}
          >
            <option value="">All Services</option>
            {allServices.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Rating"
            className="input-field max-w-xs"
            min={1}
            max={5}
            step={0.1}
            value={filters.minRating}
            onChange={e => setFilters(f => ({ ...f, minRating: e.target.value }))}
          />
        </div>
        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGardeners.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No gardeners found matching your criteria.
            </div>
          )}
          {filteredGardeners.map(g => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card flex flex-col items-center text-center"
            >
              <img src={g.photo} alt={g.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-garden-light" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">{g.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" /> {g.location}
              </div>
              <div className="flex items-center gap-2 text-garden mb-2">
                <BadgeDollarSign className="w-4 h-4" /> <span className="font-semibold">${g.price}</span> / hour
              </div>
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Star className="w-4 h-4" /> <span className="font-semibold">{g.rating}</span>
              </div>
              <div className="text-gray-600 text-sm mb-2">Age: {g.age}</div>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {g.services.map(s => (
                  <span key={s} className="bg-garden-light text-garden text-xs px-2 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{g.bio}</p>
              <Link
                to={`/gardener/${g.id}`}
                className="btn-primary w-full mt-auto"
              >
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchGardeners; 