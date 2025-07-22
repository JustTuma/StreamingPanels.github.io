import React, { useState } from 'react';
import { Service } from '../types';
import { AddIcon, DeleteIcon, ServicesIcon } from './Icons';

interface ServiceManagerProps {
  services: Service[];
  addService: (name: string) => void;
  removeService: (id: string) => void;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({ services, addService, removeService }) => {
  const [newServiceName, setNewServiceName] = useState('');

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim()) {
      addService(newServiceName.trim());
      setNewServiceName('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Gestionar Servicios</h1>
        <p className="text-slate-400">Añade o elimina los servicios de streaming que ofreces.</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleAddService} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="Ej: Crunchyroll"
            className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!newServiceName.trim()}
          >
            <AddIcon className="h-5 w-5 mr-2" />
            Añadir Servicio
          </button>
        </form>
      </div>
      
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Servicios Disponibles</h2>
        <ul className="space-y-3">
          {services.length > 0 ? services.map(service => (
            <li key={service.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md animate-fade-in">
              <span className="text-slate-200 flex items-center">
                <ServicesIcon className="h-5 w-5 mr-3 text-indigo-400"/>
                {service.name}
              </span>
              <button
                onClick={() => removeService(service.id)}
                className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                aria-label={`Eliminar ${service.name}`}
              >
                <DeleteIcon className="h-5 w-5" />
              </button>
            </li>
          )) : (
             <p className="text-center text-slate-500 py-4">Aún no se han añadido servicios.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ServiceManager;
