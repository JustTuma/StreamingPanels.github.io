import React, { useState } from 'react';
import { Account, Service, Profile, Customer } from '../types';
import { AddIcon, EditIcon, DeleteIcon, UserIcon, PhoneIcon, CalendarIcon, EmailIcon, PasswordIcon, NotesIcon, CopyIcon, EyeClosedIcon, EyeOpenIcon } from './Icons';
import AddProfileModal from './AddProfileModal';
import EditAccountModal from './EditAccountModal';
import EditProfileModal from './EditProfileModal';

interface AccountCardProps {
  account: Account;
  service: Service;
  customers: Customer[];
  customerMap: Record<string, Customer>;
  onUpdateAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onAddProfile: (accountId: string, profile: Omit<Profile, 'id'>) => void;
  onUpdateProfile: (accountId: string, profile: Profile) => void;
  onDeleteProfile: (accountId: string, profileId: string) => void;
}

const ServiceLogo: React.FC<{ serviceId: string }> = ({ serviceId }) => {
    const logos: { [key: string]: string } = {
        netflix: 'https://img.icons8.com/color/48/netflix.png',
        disneyplus: 'https://img.icons8.com/color/48/disney-plus.png',
        amazonprime: 'https://img.icons8.com/color/48/amazon-prime-video.png',
        max: 'https://img.icons8.com/?size=48&id=z540Co6Jp6SY&format=png&color=000000',
        crunchyroll: 'https://img.icons8.com/color/48/crunchyroll.png',
        spotify: 'https://img.icons8.com/color/48/spotify--v1.png',
        youtubepremium: 'https://img.icons8.com/color/48/youtube-premium.png',
        appletvplus: 'https://img.icons8.com/color/48/apple-tv.png',
        paramountplus: 'https://img.icons8.com/color/48/paramount-plus.png',
        starplus: 'https://img.icons8.com/color/48/star-plus.png',
        tidal: 'https://img.icons8.com/fluency/48/tidal.png',
    };
    const logoUrl = logos[serviceId] || 'https://img.icons8.com/ios-filled/50/FFFFFF/tv-show.png';
    return <img src={logoUrl} alt={serviceId} className="h-10 w-10 mr-4"/>;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    // Maybe show a small toast/tooltip notification later
  });
};

const AccountCard: React.FC<AccountCardProps> = ({ account, service, customers, customerMap, onUpdateAccount, onDeleteAccount, onAddProfile, onUpdateProfile, onDeleteProfile }) => {
  const [isAddProfileModalOpen, setAddProfileModalOpen] = useState(false);
  const [isEditAccountModalOpen, setEditAccountModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const expirationDate = new Date(account.expirationDate);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getExpirationBadge = () => {
    if (diffDays <= 0) {
      return <span className="text-xs font-semibold px-2 py-1 bg-red-800 text-red-100 rounded-full">Expirada</span>;
    }
    if (diffDays <= 7) {
      return <span className="text-xs font-semibold px-2 py-1 bg-yellow-700 text-yellow-100 rounded-full">Vence en {diffDays} días</span>;
    }
    return <span className="text-xs font-semibold px-2 py-1 bg-green-800 text-green-100 rounded-full">Vence en {diffDays} días</span>;
  };

  const occupancyPercentage = (account.profiles.length / account.maxProfiles) * 100;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20 hover:ring-1 hover:ring-slate-700 flex flex-col">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {service && <ServiceLogo serviceId={service.id} />}
            <div>
              <h3 className="text-xl font-bold text-white">{service?.name || 'Servicio Desconocido'}</h3>
              <div className="text-sm text-slate-400 flex items-center">
                <EmailIcon className="w-4 h-4 mr-2 flex-shrink-0" /> 
                <span className="truncate mr-2">{account.email}</span>
                <button onClick={() => copyToClipboard(account.email)} className="text-slate-500 hover:text-white"><CopyIcon className="w-4 h-4"/></button>
              </div>
              {account.password && (
                <div className="text-sm text-slate-400 flex items-center mt-1">
                  <PasswordIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate mr-2">{isPasswordVisible ? account.password : '••••••••'}</span>
                  <button onClick={() => setPasswordVisible(!isPasswordVisible)} className="text-slate-500 hover:text-white mr-2">
                    {isPasswordVisible ? <EyeClosedIcon className="w-4 h-4" /> : <EyeOpenIcon className="w-4 h-4" />}
                  </button>
                  <button onClick={() => copyToClipboard(account.password ?? '')} className="text-slate-500 hover:text-white"><CopyIcon className="w-4 h-4"/></button>
                </div>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setEditAccountModalOpen(true)} className="text-slate-400 hover:text-white"><EditIcon className="w-5 h-5"/></button>
            <button onClick={() => onDeleteAccount(account.id)} className="text-slate-400 hover:text-red-500"><DeleteIcon className="w-5 h-5"/></button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center text-slate-300">
             <CalendarIcon className="w-4 h-4 mr-2 text-indigo-400"/>
             Vence el: {expirationDate.toLocaleDateString()}
          </div>
          {getExpirationBadge()}
        </div>
      </div>
      
      <div className="bg-slate-800/50 px-5 py-4 flex-grow flex flex-col">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-slate-200">Perfiles</h4>
            <span className="text-sm font-medium text-slate-300">{account.profiles.length} / {account.maxProfiles}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-3 mb-4 flex-grow">
          {account.profiles.length > 0 ? account.profiles.map(profile => {
            const customer = customerMap[profile.customerId];
            return (
              <div key={profile.id} className="bg-slate-700/50 p-3 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white flex items-center"><UserIcon className="w-4 h-4 mr-2"/> {profile.name}</p>
                    {customer && <p className="text-sm text-slate-400 flex items-center mt-1"><PhoneIcon className="w-4 h-4 mr-2"/> {customer.name} - {customer.phone}</p>}
                    {profile.notes && <p className="text-sm text-slate-400 flex items-start mt-1"><NotesIcon className="w-4 h-4 mr-2 mt-1 flex-shrink-0"/> <span>{profile.notes}</span></p>}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                     <div className="flex space-x-2">
                      <button onClick={() => setEditingProfile(profile)} className="text-slate-400 hover:text-white"><EditIcon className="w-4 h-4"/></button>
                      <button onClick={() => onDeleteProfile(account.id, profile.id)} className="text-slate-400 hover:text-red-500"><DeleteIcon className="w-4 h-4"/></button>
                     </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${profile.paymentStatus === 'Pagado' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                        {profile.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                  </div>
                </div>
              </div>
            )
          }) : <p className="text-slate-500 text-sm text-center py-4">No hay perfiles en esta cuenta.</p>}
        </div>
        
        <button 
          onClick={() => setAddProfileModalOpen(true)} 
          className="w-full flex items-center justify-center text-sm text-indigo-400 hover:text-indigo-300 font-semibold bg-slate-700/50 hover:bg-slate-700/80 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={account.profiles.length >= account.maxProfiles}
        >
          <AddIcon className="w-4 h-4 mr-1"/>
          Añadir Perfil
        </button>
      </div>

      {isAddProfileModalOpen && (
        <AddProfileModal
          isOpen={isAddProfileModalOpen}
          onClose={() => setAddProfileModalOpen(false)}
          onAddProfile={(p) => onAddProfile(account.id, p)}
          customers={customers}
        />
      )}
      {isEditAccountModalOpen && (
        <EditAccountModal
          isOpen={isEditAccountModalOpen}
          onClose={() => setEditAccountModalOpen(false)}
          onUpdateAccount={onUpdateAccount}
          account={account}
          services={[{ id: service.id, name: service.name }]}
        />
      )}
      {editingProfile && (
        <EditProfileModal
          isOpen={!!editingProfile}
          onClose={() => setEditingProfile(null)}
          onUpdateProfile={(p) => onUpdateProfile(account.id, p)}
          profile={editingProfile}
          customers={customers}
        />
      )}
    </div>
  );
};

export default AccountCard;