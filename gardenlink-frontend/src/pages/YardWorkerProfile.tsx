import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeDollarSign, Leaf, Mail } from 'lucide-react';
import { getYardWorkerProfile, getYardWorkerReviews } from '../api';

const maskEmail = (email: string) => {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return user[0] + '***' + user.slice(-1) + '@' + domain;
};

const YardWorkerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');
  const [reviewForm, setReviewForm] = useState({ email: '', rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    getYardWorkerProfile(id)
      .then(data => setProfile(data))
      .catch(err => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    setReviewsError('');
    getYardWorkerReviews(id)
      .then(data => setReviews(data))
      .catch(err => setReviewsError(err.message || 'Failed to load reviews'))
      .finally(() => setReviewsLoading(false));
  }, [id]);

  // Review form handlers
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReviewForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess(false);
    try {
      const res = await fetch(`http://localhost:4000/api/yardworkers/reviews/pending`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: id,
          email: reviewForm.email,
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      setReviewSuccess(true);
      setReviewForm({ email: '', rating: 5, comment: '' });
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
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

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Profile not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center gap-6 mb-6">
            <img
              src={profile.photo || '/vite.svg'}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-5 h-5 text-garden" />
                <span className="text-2xl font-bold text-garden">{profile.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MapPin className="w-4 h-4" /> {profile.location} ({profile.zip})
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <BadgeDollarSign className="w-4 h-4 text-garden" /> ${profile.price}/hr
              </div>
              <div className="flex items-center gap-2 text-yellow-500 mb-1">
                <Star className="w-4 h-4" /> <span className="font-semibold">{profile.averageRating ?? 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                Age: {profile.age}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.services?.map((s: any) => (
                  <span key={s.id || s.name} className="bg-garden-light text-garden px-2 py-1 rounded text-xs font-medium">{s.name}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1">About</h3>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
          </div>
          <div className="flex gap-4 items-center mt-6 mb-8">
            <a
              href={`mailto:${profile.email}`}
              className="btn-primary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Contact Yard Worker
            </a>
            <Link to="/search" className="btn-secondary">Back to Search</Link>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 w-full">
            <h2 className="text-xl font-bold text-garden flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" /> Reviews
            </h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm mb-4">No reviews yet.</p>
            ) : (
              <div className="mb-4 w-full">{reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold text-gray-800">{review.rating}/5</span>
                    <span className="text-xs text-gray-400 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-700 mb-1">{review.comment || <span className="italic text-gray-400">No comment</span>}</div>
                  <div className="text-xs text-gray-500">By {maskEmail(review.user?.email || 'anonymous')}</div>
                </div>
              ))}</div>
            )}
            <hr className="my-4" />
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full">
              <h3 className="font-semibold mb-2">Leave a Review</h3>
              {reviewSuccess ? (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded p-4 mb-4 text-center">
                  Thank you! Please check your email to verify and publish your review.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-md">
                  <input
                    name="email"
                    type="email"
                    className="input-field"
                    placeholder="Your email"
                    value={reviewForm.email}
                    onChange={handleReviewChange}
                    required
                    disabled={reviewLoading || reviewSuccess}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                      name="rating"
                      type="number"
                      min={1}
                      max={5}
                      className="input-field"
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      required
                      disabled={reviewLoading || reviewSuccess}
                    />
                  </div>
                  <textarea
                    name="comment"
                    className="input-field"
                    placeholder="Your review (optional)"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    rows={3}
                    disabled={reviewLoading || reviewSuccess}
                  />
                  {reviewError && <div className="text-red-600 text-center text-sm">{reviewError}</div>}
                  <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={reviewLoading || reviewSuccess}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default YardWorkerProfile;
