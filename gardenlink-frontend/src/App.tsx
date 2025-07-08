import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import YardWorkerAuth from './pages/YardWorkerAuth';
import YardWorkerDashboard from './pages/YardWorkerDashboard';
import SearchYardWorkers from './pages/SearchYardWorkers';
import YardWorkerProfile from './pages/YardWorkerProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentDashboard from './components/PaymentDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/yardworker/auth" element={<YardWorkerAuth />} />
              <Route 
                path="/yardworker/dashboard" 
                element={
                  <ProtectedRoute>
                    <YardWorkerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/yardworker/payments" 
                element={
                  <ProtectedRoute>
                    <PaymentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/search" element={<SearchYardWorkers />} />
              <Route path="/yardworker/:id" element={<YardWorkerProfile />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
