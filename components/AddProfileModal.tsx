import React, { useState } from 'react';
import { Profile, Customer, PaymentStatus } from '../types';

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProfile: (profile: Omit<Profile, 'id'>) => void;
  customers: Customer[];
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onAddProfile, customers }) => {
  const [profileName, setProfileName] = useState('');
  const [customerId, setCustomerId] = useState<string>(customers[0]?.id || '');
  const [price, setPrice] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pendiente');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !customerId) {
      alert('Por favor, rellena el nombre del perfil y selecciona un cliente.');
      return;
    }
    onAddProfile({ name: profileName, customerId, price, paymentStatus, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4 animate-scale-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">Añadir Nuevo Perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="profileName" className="block text-sm font-medium text-slate-300 mb-1">Nombre del Perfil</label>
              <input type="text" id="profileName" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-slate-300 mb-1">Cliente</label>
              <select id="customer" value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                <option value="" disabled>Selecciona un cliente</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">Precio (€)</label>
                <input type="number" step="0.01" id="price" value={price} onChange={e => setPrice(parseFloat(e.target.value) || 0)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-slate-300 mb-1">Estado de Pago</label>
                <select id="paymentStatus" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as PaymentStatus)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Notas (Opcional)</label>
              <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Añadir Perfil</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfileModal;
