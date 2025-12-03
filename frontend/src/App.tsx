// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PeriodicTable from './assets/pages/PeriodicTable';
import './index.css'; // Đảm bảo đã import CSS của Tailwind

const App: React.FC = () => {
  return (
    // Router: Context Provider cho toàn bộ hệ thống điều hướng
    <Router>
      <div className="app-container">
        {/* Routes: Nơi định nghĩa các cặp URL -> Component */}
        <Routes>
          {/* Khi user vào đường dẫn gốc "/", render PeriodicTable */}
          <Route path="/" element={<PeriodicTable />} />
          
          {/* Example: Sau này bạn có thể thêm các route khác dễ dàng
          <Route path="/about" element={<AboutPage />} /> 
          */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;