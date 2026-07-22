import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';          // আপনার Login ফাইল ইমপোর্ট করা হলো
import Dashboard from './Dashboard';  // আপনার Dashboard ফাইল ইমপোর্ট করা হলো

// ProtectedRoute: লগইন ছাড়া কেউ ড্যাশবোর্ডে ঢুকতে পারবে না
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ডিফল্ট পেজ বা প্রথম পেজ হিসেবে লগইন থাকবে */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* লগইন রাউট */}
        <Route path="/login" element={<Login />} />
        
        {/* ড্যাশবোর্ড রাউট (সুরক্ষিত) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
