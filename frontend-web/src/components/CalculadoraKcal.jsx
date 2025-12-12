import React, { useState } from 'react';
import { Calculator, Flame, Info } from 'lucide-react';

const FACTORES = [
  { label: 'Adulto Castrado', value: 1.6 },
  { label: 'Adulto Intacto', value: 1.8 },
  { label: 'Pérdida de Peso', value: 1.0 },
  { label: 'Cachorro (< 4 meses)', value: 3.0 },
  { label: 'Cachorro (> 4 meses)', value: 2.0 },
  { label: 'Trabajo / Activo', value: 2.0 },
  { label: 'Senior / Inactivo', value: 1.4 },
];

const CalculadoraKcal = ({ peso }) => {
  const [factorSeleccionado, setFactorSeleccionado] = useState(1.6); // Default: Adulto Castrado

  // 1. Calcular RER (Requerimiento Energético en Reposo)
  // Fórmula: 70 * (Peso en kg ^ 0.75)
  const rer = peso ? Math.round(70 * Math.pow(peso, 0.75)) : 0;

  // 2. Calcular DER (Requerimiento Energético Diario)
  // Fórmula: RER * Factor
  const der = Math.round(rer * factorSeleccionado);

  if (!peso) return null;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator className="text-paw-purple" size={20} /> Calculadora Energética
      </h3>

      <div className="bg-purple-50 p-4 rounded-xl mb-4 border border-purple-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">RER (Reposo)</span>
          <Info size={14} className="text-purple-400" />
        </div>
        <p className="text-2xl font-bold text-paw-dark">{rer} <span className="text-sm font-medium text-gray-500">kcal/día</span></p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Estado Fisiológico</label>
          <select 
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-paw-purple/50"
            value={factorSeleccionado}
            onChange={(e) => setFactorSeleccionado(parseFloat(e.target.value))}
          >
            {FACTORES.map((f, index) => (
              <option key={index} value={f.value}>
                {f.label} (x{f.value})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-paw-orange p-4 rounded-xl text-white shadow-md">
          <div className="flex items-center gap-2 mb-1 opacity-90">
            <Flame size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Requerimiento Diario (DER)</span>
          </div>
          <p className="text-3xl font-extrabold">{der} <span className="text-base font-normal opacity-80">kcal</span></p>
        </div>
      </div>
    </div>
  );
};

export default CalculadoraKcal;