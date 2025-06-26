import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import GardenerAuth from './pages/GardenerAuth';
import GardenerDashboard from './pages/GardenerDashboard';
import SearchGardeners from './pages/SearchGardeners';
import GardenerProfile from './pages/GardenerProfile';
import About from './pages/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/gardener/auth" element={<GardenerAuth />} />
              <Route 
                path="/gardener/dashboard" 
                element={
                  <ProtectedRoute>
                    <GardenerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/search" element={<SearchGardeners />} />
              <Route path="/gardener/:id" element={<GardenerProfile />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
