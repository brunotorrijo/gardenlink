import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeDollarSign, Leaf } from 'lucide-react';
import { searchGardeners } from '../api';

const allServices = [
  'Lawn Mowing',
  'Planting',
  'Garden Design',
  'Maintenance',
];

const PAGE_SIZE = 8;

const SearchGardeners = () => {
  const [gardeners, setGardeners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchGardeners = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchGardeners({
        location: location || undefined,
        service: service || undefined,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      setGardeners(data);
      setTotal(data.length < PAGE_SIZE && page === 1 ? data.length : page * PAGE_SIZE + (data.length === PAGE_SIZE ? 1 : 0));
    } catch (err: any) {
      setError(err.message || 'Failed to load gardeners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGardeners();
    // eslint-disable-next-line
  }, [location, service, minPrice, maxPrice, page]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGardeners();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 card"
        >
          <form onSubmit={handleFilter} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1">Location or ZIP</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Austin, 78701"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1">Service</label>
              <select
                className="input-field"
                value={service}
                onChange={e => setService(e.target.value)}
              >
                <option value="">All</option>
                {allServices.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                type="number"
                className="input-field"
                placeholder="$"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                min={0}
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                type="number"
                className="input-field"
                placeholder="$"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                min={0}
              />
            </div>
            <button type="submit" className="btn-primary px-8">Search</button>
          </form>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-garden"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : gardeners.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No gardeners found. Try adjusting your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardeners.map(gardener => (
              <motion.div
                key={gardener.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(`/gardener/${gardener.id}`)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={gardener.photo || '/vite.svg'}
                    alt={gardener.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="font-bold text-lg text-garden">{gardener.name}</div>
                    <div className="text-gray-600 text-sm flex items-center gap-1"><MapPin className="w-4 h-4" /> {gardener.location}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {gardener.services?.map((s: any) => (
                    <span key={s.id || s.name} className="bg-garden-light text-garden px-2 py-1 rounded text-xs font-medium">{s.name}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <BadgeDollarSign className="w-4 h-4 text-garden" />
                  <span className="text-gray-700 text-sm">${gardener.price}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-700 text-sm">{gardener.averageRating ?? 'N/A'}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <span className="font-medium">Contact:</span>
                    <span>{gardener.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${gardener.email}`}
                      className="btn-primary text-xs px-3 py-1 flex-1 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Email
                    </a>
                    <Link
                      to={`/gardener/${gardener.id}`}
                      className="btn-secondary text-xs px-3 py-1 flex-1 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="btn-secondary px-4"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">Page {page}</span>
          <button
            className="btn-secondary px-4"
            onClick={() => setPage(p => p + 1)}
            disabled={gardeners.length < PAGE_SIZE || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchGardeners; 