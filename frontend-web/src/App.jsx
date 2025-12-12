import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Pacientes from './pages/Pacientes';
import PacienteDetalle from './pages/PacienteDetalle';
import CrearDieta from './pages/CrearDieta';


import Dashboard from './pages/Dashboard'; 
import SolicitudDetalle from './pages/SolicitudDetalle';

// Componente para proteger rutas (esto se queda igual)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

// ❌ AQUÍ BORRAMOS EL COMPONENTE "const Dashboard = () => ..." QUE TENÍAS ANTES

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/solicitudes/:id" element={<ProtectedRoute><SolicitudDetalle /></ProtectedRoute>} /> {}
        <Route path="/pacientes" element={<ProtectedRoute><Pacientes /></ProtectedRoute>} />
        <Route path="/pacientes/:id" element={<ProtectedRoute><PacienteDetalle /></ProtectedRoute>} />
        <Route path="/pacientes/:mascotaId/crear-dieta" element={<ProtectedRoute><CrearDieta /></ProtectedRoute>} />

        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              {/* Ahora React usará el Dashboard importado de ./pages/Dashboard.jsx */}
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;