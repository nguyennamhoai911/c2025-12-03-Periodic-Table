// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PeriodicTable from './assets/pages/PeriodicTable';
import './index.css'; 

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PeriodicTable />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;