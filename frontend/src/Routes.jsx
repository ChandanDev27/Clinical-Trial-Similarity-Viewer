import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ListView from './pages/ListView/ListView';
import Dashboard from './pages/Dashboard/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListView />} /> {/* Default route */}
        <Route path="/listview" element={<ListView />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
