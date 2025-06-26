import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeDollarSign, Leaf, Mail } from 'lucide-react';

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
    bio: 'Experienced gardener with a passion for sustainable landscapes.',
    email: 'alex.green@email.com',
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
    bio: 'Lawn care specialist with 10+ years of experience.',
    email: 'maria.flores@email.com',
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
    bio: 'Creative garden designer and plant lover.',
    email: 'sam.patel@email.com',
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
    bio: 'Reliable and friendly gardener for all your needs.',
    email: 'linda.brown@email.com',
  },
];

const GardenerProfile = () => {
  const { id } = useParams();
  const gardener = mockGardeners.find(g => g.id === id);

  if (!gardener) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500">Gardener not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex flex-col items-center text-center"
        >
          <img src={gardener.photo} alt={gardener.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-garden-light" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{gardener.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MapPin className="w-4 h-4" /> {gardener.location} ({gardener.zip})
          </div>
          <div className="flex items-center gap-2 text-garden mb-2">
            <BadgeDollarSign className="w-4 h-4" /> <span className="font-semibold">${gardener.price}</span> / hour
          </div>
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Star className="w-4 h-4" /> <span className="font-semibold">{gardener.rating}</span>
          </div>
          <div className="text-gray-600 text-sm mb-2">Age: {gardener.age}</div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {gardener.services.map(s => (
              <span key={s} className="bg-garden-light text-garden text-xs px-2 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-gray-500 text-base mb-4 max-w-xl">{gardener.bio}</p>
          <a
            href={`mailto:${gardener.email}`}
            className="btn-primary flex items-center justify-center gap-2 w-full mb-4"
          >
            <Mail className="w-5 h-5" /> Contact {gardener.name.split(' ')[0]}
          </a>
          <Link to="/search" className="btn-secondary w-full">Back to Search</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GardenerProfile;
