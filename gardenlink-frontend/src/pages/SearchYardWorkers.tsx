import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeDollarSign, Leaf } from 'lucide-react';
import { searchYardWorkers } from '../api';

const allServices = [
  'Lawn Mowing',
  'Planting',
  'Garden Design',
  'Maintenance',
];

const PAGE_SIZE = 8;

const SearchYardWorkers = () => {
  const [yardWorkers, setYardWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const fetchYardWorkers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchYardWorkers({
        location: location || undefined,
        service: service || undefined,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      });
      setYardWorkers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load yard workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYardWorkers();
    // eslint-disable-next-line
  }, [location, service, minPrice, maxPrice, page]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchYardWorkers();
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
        ) : yardWorkers.length === 0 ? (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Yard Workers Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any yard workers matching your criteria in this area.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Try expanding your search area</p>
                <p>• Adjust your price range</p>
                <p>• Only subscribed yard workers appear in search results</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {yardWorkers.map(yardWorker => (
              <motion.div
                key={yardWorker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => navigate(`/yardworker/${yardWorker.id}`)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={yardWorker.photo || '/vite.svg'}
                    alt={yardWorker.name}
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="font-bold text-lg text-garden">{yardWorker.name}</div>
                    <div className="text-gray-600 text-sm flex items-center gap-1"><MapPin className="w-4 h-4" /> {yardWorker.location}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {yardWorker.services?.map((s: any) => (
                    <span key={s.id || s.name} className="bg-garden-light text-garden px-2 py-1 rounded text-xs font-medium">{s.name}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <BadgeDollarSign className="w-4 h-4 text-garden" />
                  <span className="text-gray-700 text-sm">${yardWorker.price}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-700 text-sm">{yardWorker.averageRating ?? 'N/A'}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <span className="font-medium">Contact:</span>
                    <span>{yardWorker.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${yardWorker.email}`}
                      className="btn-primary text-xs px-3 py-1 flex-1 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Email
                    </a>
                    <Link
                      to={`/yardworker/${yardWorker.id}`}
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
            disabled={yardWorkers.length < PAGE_SIZE || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchYardWorkers; 