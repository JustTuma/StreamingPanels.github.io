import React, { useState, useEffect } from 'react';
import { Service, Account } from '../types';
import { EyeClosedIcon, EyeOpenIcon } from './Icons';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateAccount: (account: Account) => void;
  account: Account;
  services: Service[];
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ isOpen, onClose, onUpdateAccount, account, services }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [maxProfiles, setMaxProfiles] = useState(5);
  
  useEffect(() => {
    if (account) {
      setEmail(account.email);
      setPassword(account.password || '');
      setExpirationDate(account.expirationDate);
      setMaxProfiles(account.maxProfiles);
    }
  }, [account]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !expirationDate || !maxProfiles) {
      alert('Por favor, rellena todos los campos obligatorios.');
      return;
    }
    onUpdateAccount({ ...account, email, password, expirationDate, maxProfiles });
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4 animate-scale-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">Editar Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Servicio</label>
              <p className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-2 px-3 text-slate-300">{services.find(s => s.id === account.serviceId)?.name}</p>
            </div>
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-slate-300 mb-1">Email de la Cuenta</label>
              <input type="email" id="edit-email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label htmlFor="edit-password" className="block text-sm font-medium text-slate-300 mb-1">Contraseña (Opcional)</label>
              <div className="relative">
                <input type={isPasswordVisible ? "text" : "password"} id="edit-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nueva contraseña para actualizar" />
                <button type="button" onClick={() => setPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-white">
                  {isPasswordVisible ? <EyeClosedIcon className="h-5 w-5"/> : <EyeOpenIcon className="h-5 w-5"/>}
                </button>
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="edit-expirationDate" className="block text-sm font-medium text-slate-300 mb-1">Fecha de Expiración</label>
                    <input type="date" id="edit-expirationDate" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                    <label htmlFor="edit-maxProfiles" className="block text-sm font-medium text-slate-300 mb-1">Perfiles Máx.</label>
                    <input type="number" id="edit-maxProfiles" value={maxProfiles} onChange={e => setMaxProfiles(parseInt(e.target.value, 10))} min="1" className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors">Cancelar</button>
            <button type="submit" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;
