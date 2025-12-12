import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Dog, Calendar, User } from 'lucide-react';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const res = await api.get('/nutricionista/pacientes');
        setPacientes(res.data.pacientes);
      } catch (error) {
        console.error("Error cargando pacientes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPacientes();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-paw-dark">Pacientes Atendidos</h1>
        <p className="text-gray-500">Historial de mascotas con consultas nutricionales.</p>
      </div>

      {/* Barra de búsqueda (Visual) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 border border-gray-200">
          <Search size={20} className="text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o dueño..." className="bg-transparent border-none outline-none w-full p-2 text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando pacientes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pacientes.map((pet) => (
            <div key={pet.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                   {/* Usamos una imagen por defecto si la URL no es completa o falla */}
                   <img 
                      src={pet.foto && pet.foto.includes('http') ? pet.foto : "https://cdn-icons-png.flaticon.com/512/616/616408.png"} 
                      alt={pet.nombre} 
                      className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-paw-dark group-hover:text-paw-purple transition">{pet.nombre}</h3>
                  <p className="text-sm text-gray-500">{pet.raza} ({pet.especie})</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-paw-yellow" />
                  <span>Dueño: {pet.cliente}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-paw-yellow" />
                  <span>Última visita: {new Date(pet.ultima_atencion).toLocaleDateString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/pacientes/${pet.id}`)}
                className="w-full py-2.5 rounded-xl border border-paw-purple text-paw-purple font-medium hover:bg-paw-purple hover:text-white transition flex items-center justify-center gap-2"
              >
                <Dog size={18} /> Ver Historial Completo
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Pacientes;