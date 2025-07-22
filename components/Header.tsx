import React from 'react';
import { View } from '../types';
import { DashboardIcon, ServicesIcon, SettingsIcon, UsersIcon } from './Icons';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  expiringCount: number;
}

const NavItem: React.FC<{
  label: string;
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  badgeCount?: number;
}> = ({ label, view, activeView, setActiveView, icon, badgeCount }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-slate-700 text-white'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badgeCount && badgeCount > 0 && (
         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
           {badgeCount}
         </span>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, expiringCount }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg shadow-md sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white font-bold text-xl flex items-center">
              <i className="fas fa-stream mr-2 text-indigo-400"></i>
              Centro de Control
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavItem
                label="Panel"
                view="dashboard"
                activeView={activeView}
                setActiveView={setActiveView}
                icon={<DashboardIcon className="h-5 w-5" />}
              />
              <NavItem
                label="Servicios"
                view="services"
                activeView={activeView}
                setActiveView={setActiveView}
                icon={<ServicesIcon className="h-5 w-5" />}
              />
               <NavItem
                label="Clientes"
                view="customers"
                activeView={activeView}
                setActiveView={setActiveView}
                icon={<UsersIcon className="h-5 w-5" />}
              />
              <NavItem
                label="Ajustes"
                view="settings"
                activeView={activeView}
                setActiveView={setActiveView}
                icon={<SettingsIcon className="h-5 w-5" />}
                badgeCount={expiringCount}
              />
            </div>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button could be added here */}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
