import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import FormularioAlbaran from './components/FormularioAlbaran';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/albaran" element={<FormularioAlbaranContainer />} />
      </Routes>
    </Router>
  );
};

const FormularioAlbaranContainer: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/');
    }
  }, [navigate]);

  return token ? <FormularioAlbaran token={token} /> : <Login />;
};

export default App;
