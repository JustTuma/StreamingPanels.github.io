import React, { useState, useMemo } from 'react';
import { Account, Service, Customer } from '../types';
import AccountCard from './AccountCard';
import { SearchIcon } from './Icons';

interface DashboardProps {
  accounts: Account[];
  services: Service[];
  customers: Customer[];
  onUpdateAccount: (account: Account) => void;
  onDeleteAccount: (id: string) => void;
  onAddProfile: (accountId: string, profile: any) => void;
  onUpdateProfile: (accountId: string, profile: any) => void;
  onDeleteProfile: (accountId: string, profileId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-4 rounded-lg flex items-center">
        <div className="p-3 rounded-full bg-slate-700 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ accounts, services, customers, onUpdateAccount, onDeleteAccount, onAddProfile, onUpdateProfile, onDeleteProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const serviceMap = useMemo(() => {
    return services.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {} as Record<string, Service>);
  }, [services]);

  const customerMap = useMemo(() => {
    return customers.reduce((acc, customer) => {
      acc[customer.id] = customer;
      return acc;
    }, {} as Record<string, Customer>);
  }, [customers]);

  const dashboardStats = useMemo(() => {
    const allProfiles = accounts.flatMap(acc => acc.profiles);
    const totalRevenue = allProfiles
      .filter(p => p.paymentStatus === 'Pagado')
      .reduce((sum, p) => sum + p.price, 0);
    const pendingPayments = allProfiles.filter(p => p.paymentStatus === 'Pendiente').length;
    
    return {
      totalAccounts: accounts.length,
      soldProfiles: allProfiles.length,
      totalRevenue: totalRevenue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }),
      pendingPayments,
    };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts;
    const lowercasedFilter = searchTerm.toLowerCase();
    return accounts.filter(account => {
      const serviceName = serviceMap[account.serviceId]?.name.toLowerCase() || '';
      const accountEmail = account.email.toLowerCase();
      
      const hasMatchingProfile = account.profiles.some(profile => {
        const customer = customerMap[profile.customerId];
        return customer?.name.toLowerCase().includes(lowercasedFilter) ||
               customer?.phone.toLowerCase().includes(lowercasedFilter);
      });

      return serviceName.includes(lowercasedFilter) || 
             accountEmail.includes(lowercasedFilter) || 
             hasMatchingProfile;
    });
  }, [searchTerm, accounts, serviceMap, customerMap]);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Cuentas</h1>
        <p className="text-slate-400">Gestiona todas tus cuentas activas y perfiles de clientes.</p>
      </div>
      
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total de Cuentas" value={dashboardStats.totalAccounts} icon={<i className="fa-solid fa-cloud text-xl text-indigo-400"></i>} />
          <StatCard title="Perfiles Vendidos" value={dashboardStats.soldProfiles} icon={<i className="fa-solid fa-users text-xl text-sky-400"></i>} />
          <StatCard title="Ingresos Totales" value={dashboardStats.totalRevenue} icon={<i className="fa-solid fa-sack-dollar text-xl text-emerald-400"></i>} />
          <StatCard title="Pagos Pendientes" value={dashboardStats.pendingPayments} icon={<i className="fa-solid fa-hourglass-half text-xl text-amber-400"></i>} />
      </div>

      <div className="mb-6 sticky top-[65px] z-30 bg-slate-900/80 backdrop-blur-sm py-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por servicio, email, nombre o teléfono de cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      {filteredAccounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.sort((a,b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()).map(account => (
            <AccountCard 
              key={account.id} 
              account={account} 
              service={serviceMap[account.serviceId]}
              customers={customers}
              customerMap={customerMap}
              onUpdateAccount={onUpdateAccount}
              onDeleteAccount={onDeleteAccount}
              onAddProfile={onAddProfile}
              onUpdateProfile={onUpdateProfile}
              onDeleteProfile={onDeleteProfile}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white">No se encontraron cuentas</h3>
          <p className="text-slate-400 mt-2">
            {searchTerm 
              ? "Tu búsqueda no coincidió con ninguna cuenta. Intenta con otras palabras." 
              : "Haz clic en el botón '+' para añadir tu primera cuenta de streaming."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
