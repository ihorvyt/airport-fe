import './styles/default.scss'

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/index.jsx';
import HomePage from "./pages/home/index.jsx";
import Flight from "./pages/flight/index.jsx";
import RegistrationPage from "./pages/register/index.jsx";
import MyTicketsPage from "./pages/myTickets/index.jsx";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flight/:id" element={<Flight />} />
          <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route
                path="/my-tickets"
                element={<MyTicketsPage />}
            />
        </Routes>
      </Router>
  );
};

export default App;
