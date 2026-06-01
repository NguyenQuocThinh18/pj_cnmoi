/*
 * App.jsx
 * Định nghĩa route chính của ứng dụng React.
 * Chèn chú thích giải thích mục đích chính của file.
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import ChatWidget from './components/ChatWidget';
import AppUpdateNotification from './components/AppUpdateNotification';
import NotificationPermission from './components/NotificationPermission'; 

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const TourDetails = lazy(() => import('./pages/TourDetails'));
const PaymentSandbox = lazy(() => import('./pages/PaymentSandbox'));
const Account = lazy(() => import('./pages/Account'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TourList = lazy(() => import('./pages/TourList'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog')); 
const BlogDetail = lazy(() => import('./pages/BlogDetail')); 
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Policy = lazy(() => import('./pages/Policy'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const PaymentResult = lazy(() => import('./pages/PaymentResult'));

// 🔥 IMPORT TRANG VÉ ĐIỆN TỬ MỚI
const Ticket = lazy(() => import('./pages/Ticket'));

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <AppUpdateNotification />
        <Navbar />
        <NotificationPermission />

        <main className="flex-grow-1">
          <Suspense fallback={
            <div className="vh-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <div className="spinner-border text-info mb-3" role="status"></div>
                <div className="fs-5 fw-bold text-info animate-pulse">Đang tải trang...</div>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/tours/:slug" element={<TourDetails />} />
              <Route path="/tours/id/:id" element={<TourDetails />} />
              <Route path="/tour/:id" element={<TourDetails />} />
              
              <Route path="/tour-trong-nuoc" element={<TourList />} />
              <Route path="/tour-quoc-te" element={<TourList />} /> 
              
              <Route path="/gioi-thieu" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/blog/id/:id" element={<BlogDetail />} />
              
              <Route path="/lien-he" element={<Contact />} />
              <Route path="/bang-gia" element={<Pricing />} />
              <Route path="/chinh-sach" element={<Policy />} />
              <Route path="/tra-cuu" element={<OrderTracking />} />

              <Route path="/tai-khoan" element={<Account />} />
              <Route path="/payment/:bookingId" element={<PaymentSandbox />} />
              <Route path="/payment-result" element={<PaymentResult />} />
              
              {/* 🔥 ROUTE DẪN TỚI TRANG VÉ ĐIỆN TỬ QR CHECK-IN */}
              <Route path="/ticket/:id" element={<Ticket />} />

              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;