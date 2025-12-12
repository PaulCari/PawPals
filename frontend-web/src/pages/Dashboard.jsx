import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Search,
  MoreHorizontal
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Datos simulados para las tablas
  const recetasPendientes = [
    { id: 1, paciente: 'Pedro G.', mascota: 'Buddy', fecha: '10 Feb', hora: '14:00', estado: 'Pendiente' },
    { id: 2, paciente: 'Ana R.', mascota: 'Mia', fecha: '10 Feb', hora: '15:30', estado: 'Pendiente' },
    { id: 3, paciente: 'Carlos S.', mascota: 'Max', fecha: '11 Feb', hora: '09:00', estado: 'Revisando' },
  ];

  const estadisticas = [
    { label: 'Pacientes', value: '150+', icon: Users, sub: 'Totales' },
    { label: 'Pedidos', value: '350+', icon: FileText, sub: 'Creados' },
    { label: 'Satisfacción', value: '95%', icon: TrendingUp, sub: 'Cliente' },
  ];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === COLUMNA IZQUIERDA (2/3) === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Banner de Bienvenida */}
          <div className="bg-gradient-to-r from-paw-dark to-paw-purple rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">¡Bienvenida, {user?.nombre || 'Dra. Sofia'}!</h2>
              <p className="text-purple-100 mb-6 max-w-md">
                Tienes <span className="font-bold text-white">3 nuevas recetas</span> por revisar hoy. 
                Recuerda verificar las alergias antes de aprobar.
              </p>
              <button className="bg-paw-yellow text-paw-dark px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition shadow-md">
                Ver Recetas
              </button>
            </div>
            {/* Decoración de fondo */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <Users size={200} />
            </div>
          </div>

          {/* 2. Tabla: Recetas Pendientes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Recetas Pendientes</h3>
              <button className="text-gray-400 hover:text-paw-purple"><MoreHorizontal /></button>
            </div>

            <div className="space-y-4">
              {/* Buscador interno */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar paciente..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-paw-purple"
                />
              </div>

              {/* Lista */}
              {recetasPendientes.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition border border-transparent hover:border-gray-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-paw-dark font-bold border border-gray-200">
                      {item.paciente.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.paciente} <span className="text-gray-400 font-normal">({item.mascota})</span></p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {item.fecha} • {item.hora}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-paw-dark text-white text-xs font-medium rounded-lg hover:bg-paw-purple transition">
                    Revisar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Próximos Pedidos Personalizados */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Próximos Pedidos Personalizados</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-medium">Paciente</th>
                    <th className="pb-3 font-medium">Mascota</th>
                    <th className="pb-3 font-medium">Fecha Entrega</th>
                    <th className="pb-3 font-medium text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-600">
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-800">Pedro G.</td>
                    <td className="py-4">Buddy</td>
                    <td className="py-4">Mañana</td>
                    <td className="py-4 text-right"><span className="text-orange-500 font-medium">En Preparación</span></td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-800">Carlos S.</td>
                    <td className="py-4">Max</td>
                    <td className="py-4">12 Feb</td>
                    <td className="py-4 text-right"><span className="text-green-500 font-medium">Listo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* === COLUMNA DERECHA (1/3) === */}
        <div className="space-y-8">
          
          {/* 4. Estadísticas Rápidas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Estadísticas Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              {estadisticas.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center p-4 rounded-xl ${index === 2 ? 'col-span-2 flex-row justify-center gap-4' : 'bg-gray-50'}`}>
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

          {/* 5. Actividad Reciente */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Actividad Reciente</h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-gray-100">
              
              <div className="relative pl-10">
                <div className="absolute left-2 top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                <p className="text-sm font-medium text-gray-800">Receta de 'Buddy' aprobada</p>
                <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-2 top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                <p className="text-sm font-medium text-gray-800">Nuevo paciente registrado: Ana R.</p>
                <p className="text-xs text-gray-400 mt-1">Hace 5 horas</p>
              </div>

              <div className="relative pl-10">
                <div className="absolute left-2 top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white shadow-sm"></div>
                <p className="text-sm font-medium text-gray-800">Pedido #2024-003 finalizado</p>
                <p className="text-xs text-gray-400 mt-1">Ayer</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;