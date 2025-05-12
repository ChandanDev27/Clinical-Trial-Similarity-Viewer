import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import ListView component
import ListView from './pages/ListView/ListView';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListView />} /> {/* Default route */}
        <Route path="/listview" element={<ListView />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
