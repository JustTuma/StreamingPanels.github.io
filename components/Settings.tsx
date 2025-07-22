import React, { useState } from 'react';
import { TelegramSettings, Account } from '../types';
import { SaveIcon, TelegramIcon } from './Icons';

interface SettingsProps {
  settings: TelegramSettings;
  setSettings: (settings: TelegramSettings) => void;
  expiringAccounts: Account[];
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, expiringAccounts }) => {
  const [localSettings, setLocalSettings] = useState<TelegramSettings>(settings);

  const handleSave = () => {
    setSettings(localSettings);
    alert('¡Ajustes guardados!');
  };
  
  const handleTestNotification = (account: Account) => {
    const message = `
      *Alerta de Stream: ¡Cuenta a punto de expirar!*

      *Servicio:* ${account.serviceId.charAt(0).toUpperCase() + account.serviceId.slice(1)}
      *Cuenta:* \`${account.email}\`
      *Fecha de expiración:* ${new Date(account.expirationDate).toLocaleDateString()}
      
      *Perfiles asociados:*
      ${account.profiles.map(p => `- ${p.name}`).join('\n')}

      Por favor, toma acción para renovar la cuenta.
    `;

    if (!localSettings.botToken || !localSettings.chatId) {
        alert("Por favor, configura tu Bot Token y Chat ID antes de enviar una notificación.");
        return;
    }

    const url = `https://api.telegram.org/bot${localSettings.botToken}/sendMessage`;
    const params = new URLSearchParams({
      chat_id: localSettings.chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    
    console.log("--- Simulación de Petición a la API de Telegram ---");
    console.log("Esto debería ser manejado por un backend seguro.");
    console.log("URL:", url);
    console.log("Body:", params.toString());
    
    alert(`Se ha preparado una notificación de prueba para ${account.email} y se ha registrado en la consola. En una aplicación real, esto se enviaría a través de un backend seguro.`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Ajustes</h1>
        <p className="text-slate-400">Configura los ajustes de tu aplicación y notificaciones.</p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <TelegramIcon className="h-6 w-6 mr-3 text-sky-400" />
          Configuración del Bot de Telegram
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="botToken" className="block text-sm font-medium text-slate-300 mb-1">Bot Token</label>
            <input
              type="password"
              id="botToken"
              value={localSettings.botToken}
              onChange={(e) => setLocalSettings({ ...localSettings, botToken: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Introduce tu Bot Token de Telegram"
            />
          </div>
          <div>
            <label htmlFor="chatId" className="block text-sm font-medium text-slate-300 mb-1">Chat ID</label>
            <input
              type="text"
              id="chatId"
              value={localSettings.chatId}
              onChange={(e) => setLocalSettings({ ...localSettings, chatId: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Introduce el Chat ID de destino"
            />
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Guardar Ajustes
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4">
            <i className="fas fa-shield-alt mr-1"></i>
            Nota de seguridad: Los tokens de bot son sensibles. En un entorno de producción, deberían gestionarse a través de variables de entorno seguras en el lado del servidor, no almacenarse en el almacenamiento local del navegador.
        </p>
      </div>

      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Cuentas por Expirar (en 3 días)</h2>
        {expiringAccounts.length > 0 ? (
          <ul className="space-y-3">
            {expiringAccounts.map(account => (
              <li key={account.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                <div>
                  <p className="font-semibold text-white">{account.serviceId.toUpperCase()}</p>
                  <p className="text-sm text-slate-300">{account.email}</p>
                </div>
                <button 
                  onClick={() => handleTestNotification(account)}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors duration-200 flex items-center"
                >
                  <TelegramIcon className="h-4 w-4 mr-2" />
                  Enviar Prueba
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-4">Ninguna cuenta expira en los próximos 3 días.</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
