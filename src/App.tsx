import React from 'react';
import MapPage from './pages/MapPage.tsx';
import { HashRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <MapPage />
    </Router>
  );
};

export default App;