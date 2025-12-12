import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Clock, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronDown 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Inicio', path: '/', icon: LayoutDashboard },
    { name: 'Recetas Pendientes', path: '/solicitudes', icon: FileText },
    { name: 'Pacientes', path: '/pacientes', icon: Users },
    { name: 'Historial de Pedidos', path: '/historial', icon: Clock },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-paw-gray font-sans">
      
      {/* === SIDEBAR OSCURO === */}
      <aside className="w-64 bg-paw-dark text-white flex flex-col shadow-2xl z-20">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-paw-yellow text-3xl">🐾</span>
            <div>
              <h1 className="text-xl font-bold leading-none">PawPals</h1>
              <span className="text-xs text-paw-text-muted">Nutri-Panel</span>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-paw-purple text-white shadow-lg shadow-purple-900/50' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-white/5 rounded-xl transition"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-20 bg-paw-dark flex items-center justify-between px-8 shadow-md z-10">
          <h2 className="text-white text-lg font-medium opacity-90">Panel de Nutricionista</h2>
          
          <div className="flex items-center gap-6">
            {/* Iconos de notificacion */}
            <div className="flex items-center gap-4 text-gray-400">
              <button className="hover:text-white transition"><Search size={20} /></button>
              <button className="hover:text-white transition relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Perfil Usuario */}
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">{user?.nombre || "Dra. Sofia"}</p>
                <p className="text-xs text-paw-text-muted">Especialista</p>
              </div>
              <div className="w-10 h-10 bg-paw-purple rounded-full flex items-center justify-center text-white font-bold border-2 border-paw-dark-light">
                {user?.nombre?.charAt(0) || "D"}
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Área de Scroll */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;