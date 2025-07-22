import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { AddIcon, DeleteIcon, EditIcon, UsersIcon, SaveIcon } from './Icons';

interface CustomerManagerProps {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, addCustomer, updateCustomer, deleteCustomer }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setPhone(editingCustomer.phone);
    } else {
      setName('');
      setPhone('');
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      if (editingCustomer) {
        updateCustomer({ ...editingCustomer, name, phone });
      } else {
        addCustomer({ name, phone });
      }
      setEditingCustomer(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomer(null);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Gestionar Clientes</h1>
        <p className="text-slate-400">Añade, edita o elimina los datos de tus clientes.</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">{editingCustomer ? 'Editando Cliente' : 'Añadir Nuevo Cliente'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del cliente"
            className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono del cliente"
            className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex gap-2 w-full sm:w-auto">
            {editingCustomer && (
                <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Cancelar
                </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!name.trim() || !phone.trim()}
            >
              {editingCustomer ? <SaveIcon className="h-5 w-5 mr-2" /> : <AddIcon className="h-5 w-5 mr-2" />}
              {editingCustomer ? 'Guardar' : 'Añadir'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Lista de Clientes</h2>
        <ul className="space-y-3">
          {customers.length > 0 ? customers.map(customer => (
            <li key={customer.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md animate-fade-in">
              <span className="text-slate-200 flex items-center">
                <UsersIcon className="h-5 w-5 mr-3 text-sky-400"/>
                <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-sm text-slate-400">{customer.phone}</p>
                </div>
              </span>
              <div className="flex items-center gap-3">
                <button
                    onClick={() => setEditingCustomer(customer)}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label={`Editar ${customer.name}`}
                >
                    <EditIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                    aria-label={`Eliminar ${customer.name}`}
                >
                    <DeleteIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          )) : (
             <p className="text-center text-slate-500 py-4">No hay clientes registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomerManager;
