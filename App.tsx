import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Account, Service, Profile, Customer, TelegramSettings, View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ServiceManager from './components/ServiceManager';
import CustomerManager from './components/CustomerManager';
import Settings from './components/Settings';
import { AddIcon } from './components/Icons';
import AddAccountModal from './components/AddAccountModal';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [services, setServices] = useLocalStorage<Service[]>('services', [
    { id: 'netflix', name: 'Netflix' },
    { id: 'disneyplus', name: 'Disney+' },
    { id: 'amazonprime', name: 'Amazon Prime Video' },
    { id: 'max', name: 'Max' },
    { id: 'crunchyroll', name: 'Crunchyroll' },
    { id: 'spotify', name: 'Spotify' },
    { id: 'youtubepremium', name: 'YouTube Premium' },
    { id: 'appletvplus', name: 'Apple TV+' },
    { id: 'paramountplus', name: 'Paramount+' },
    { id: 'starplus', name: 'Star+' },
    { id: 'tidal', name: 'Tidal' },
  ]);
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [telegramSettings, setTelegramSettings] = useLocalStorage<TelegramSettings>('telegramSettings', {
    botToken: '',
    chatId: '',
  });

  const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [expiringAccounts, setExpiringAccounts] = useState<Account[]>([]);

  const checkExpiringAccounts = useCallback(() => {
    const now = new Date();
    const upcomingAccounts = accounts.filter(account => {
      const expirationDate = new Date(account.expirationDate);
      const diffTime = expirationDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 3;
    });
    setExpiringAccounts(upcomingAccounts);
  }, [accounts]);

  useEffect(() => {
    checkExpiringAccounts();
    const interval = setInterval(checkExpiringAccounts, 1000 * 60 * 60 * 24); // Check once a day
    return () => clearInterval(interval);
  }, [checkExpiringAccounts]);

  // Service Management
  const addService = (name: string) => {
    if (name && !services.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      const newService: Service = { id: name.toLowerCase().replace(/\s+/g, ''), name };
      setServices([...services, newService]);
    }
  };

  const removeService = (id: string) => {
    if (accounts.some(acc => acc.serviceId === id)) {
      alert("No se puede eliminar un servicio que está actualmente en uso por una cuenta.");
      return;
    }
    setServices(services.filter(s => s.id !== id));
  };
  
  // Account Management
  const addAccount = (account: Omit<Account, 'id' | 'profiles'>) => {
    const newAccount: Account = { ...account, id: Date.now().toString(), profiles: [] };
    setAccounts([...accounts, newAccount]);
  };
  
  const updateAccount = (updatedAccount: Account) => {
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  };
  
  const deleteAccount = (id: string) => {
    if(window.confirm('¿Estás seguro de que quieres eliminar esta cuenta y todos sus perfiles?')) {
      setAccounts(accounts.filter(acc => acc.id !== id));
    }
  };

  // Profile Management
  const addProfileToAccount = (accountId: string, profile: Omit<Profile, 'id'>) => {
    const newProfile: Profile = { ...profile, id: Date.now().toString() };
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === accountId) {
        if (acc.profiles.length >= acc.maxProfiles) {
          alert('No se pueden añadir más perfiles, se ha alcanzado el máximo para esta cuenta.');
          return acc;
        }
        return { ...acc, profiles: [...acc.profiles, newProfile] };
      }
      return acc;
    });
    setAccounts(updatedAccounts);
  };
  
  const updateProfileInAccount = (accountId: string, updatedProfile: Profile) => {
     setAccounts(accounts.map(acc => {
       if (acc.id === accountId) {
         return {
           ...acc,
           profiles: acc.profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p)
         }
       }
       return acc;
     }));
  };

  const deleteProfileFromAccount = (accountId: string, profileId: string) => {
    setAccounts(accounts.map(acc => {
       if (acc.id === accountId) {
         return {
           ...acc,
           profiles: acc.profiles.filter(p => p.id !== profileId)
         }
       }
       return acc;
     }));
  };

  // Customer Management
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...customer, id: Date.now().toString() };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const deleteCustomer = (id: string) => {
    const isCustomerInUse = accounts.some(acc => acc.profiles.some(p => p.customerId === id));
    if (isCustomerInUse) {
      alert("No se puede eliminar un cliente que está asignado a uno o más perfiles.");
      return;
    }
    setCustomers(customers.filter(c => c.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'services':
        return <ServiceManager services={services} addService={addService} removeService={removeService} />;
      case 'customers':
        return <CustomerManager customers={customers} addCustomer={addCustomer} updateCustomer={updateCustomer} deleteCustomer={deleteCustomer} />;
      case 'settings':
        return <Settings settings={telegramSettings} setSettings={setTelegramSettings} expiringAccounts={expiringAccounts} />;
      case 'dashboard':
      default:
        return <Dashboard 
                  accounts={accounts} 
                  services={services}
                  customers={customers}
                  onUpdateAccount={updateAccount}
                  onDeleteAccount={deleteAccount}
                  onAddProfile={addProfileToAccount}
                  onUpdateProfile={updateProfileInAccount}
                  onDeleteProfile={deleteProfileFromAccount}
                />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} expiringCount={expiringAccounts.length} />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {activeView === 'dashboard' && (
        <button
          onClick={() => setAddAccountModalOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
          aria-label="Añadir nueva cuenta"
        >
          <AddIcon className="h-6 w-6" />
        </button>
      )}

      {isAddAccountModalOpen && (
        <AddAccountModal
          isOpen={isAddAccountModalOpen}
          onClose={() => setAddAccountModalOpen(false)}
          onAddAccount={addAccount}
          services={services}
        />
      )}
    </div>
  );
};

export default App;