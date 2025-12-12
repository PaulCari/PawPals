import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// 👇 IMPORTAMOS EL DASHBOARD REAL (El del diseño bonito)
import Dashboard from './pages/Dashboard'; 

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