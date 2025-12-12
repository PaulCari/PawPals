import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; // <--- Importamos la API
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  Search,
  MoreHorizontal,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para datos reales
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pacientes: 0,
    pendientes: 0,
    satisfaccion: '100%'
  });

  // Cargar datos del Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/nutricionista/pedidos/pendientes');
        const data = response.data.solicitudes || [];
        
        setSolicitudes(data);
        
        // Actualizar estadísticas simples basadas en lo que llegó
        setStats({
          pacientes: data.length, // Por ahora contamos solicitudes como pacientes
          pendientes: response.data.total,
          satisfaccion: '98%'
        });

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const estadisticasCards = [
    { label: 'Pacientes Activos', value: stats.pacientes, icon: Users, sub: 'En tratamiento' },
    { label: 'Recetas Pendientes', value: stats.pendientes, icon: FileText, sub: 'Por revisar' },
    { label: 'Satisfacción', value: stats.satisfaccion, icon: TrendingUp, sub: 'Cliente' },
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUMNA IZQUIERDA (2/3) === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Banner de Bienvenida */}
          <div className="bg-gradient-to-r from-paw-dark to-paw-purple rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">¡Bienvenida, {user?.nombre?.split(' ')[0] || 'Doc'}!</h2>
              <p className="text-purple-100 mb-6 max-w-md">
                Tienes <span className="font-bold text-white text-xl">{stats.pendientes} solicitudes</span> esperando tu revisión hoy. 
              </p>
              <button 
                onClick={() => navigate('/solicitudes')}
                className="bg-paw-yellow text-paw-dark px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition shadow-md"
              >
                Ver Solicitudes
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10">
              <Users size={200} />
            </div>
          </div>

          {/* 2. Tabla: Recetas Pendientes (DATOS REALES) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Solicitudes Recientes</h3>
              <button className="text-gray-400 hover:text-paw-purple"><MoreHorizontal /></button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader className="animate-spin text-paw-purple" size={32} />
              </div>
            ) : solicitudes.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No hay solicitudes pendientes 🎉</p>
            ) : (
              <div className="space-y-4">
                {/* Mapeamos los datos reales del backend */}
                {solicitudes.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-4">
                      {/* Avatar con inicial de la mascota */}
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-paw-dark font-bold border border-gray-200">
                        {item.mascota.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {item.mascota.nombre} 
                          <span className="text-gray-400 font-normal"> ({item.mascota.especie})</span>
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {new Date(item.fecha).toLocaleDateString()} • Dueño: {item.cliente.nombre}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => navigate(`/solicitudes/${item.id}`)} // <--- AQUI LA MAGIA
                        className="px-4 py-1.5 bg-paw-dark text-white text-xs font-medium rounded-lg hover:bg-paw-purple transition"
                        >
                        Revisar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* === COLUMNA DERECHA (1/3) === */}
        <div className="space-y-8">
          
          {/* 4. Estadísticas Rápidas (DINÁMICAS) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              {estadisticasCards.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center p-4 rounded-xl ${index === 2 ? 'col-span-2 flex-row justify-center gap-4 bg-gray-50' : 'bg-gray-50'}`}>
                  <div className="p-3 bg-white rounded-full shadow-sm text-paw-purple mb-2">
                    <stat.icon size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Actividad Reciente (Estática por ahora, se puede conectar luego) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Actividad Reciente</h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-gray-100">
              
              <div className="relative pl-10">
                <div className="absolute left-2 top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                <p className="text-sm font-medium text-gray-800">Sistema iniciado</p>
                <p className="text-xs text-gray-400 mt-1">Hace un momento</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;