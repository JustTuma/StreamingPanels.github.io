export interface Service {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export type PaymentStatus = 'Pagado' | 'Pendiente';

export interface Profile {
  id: string;
  name: string;
  customerId: string;
  price: number;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface Account {
  id: string;
  serviceId: string;
  email: string;
  password?: string;
  expirationDate: string; // ISO string format
  maxProfiles: number;
  profiles: Profile[];
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
}

export type View = 'dashboard' | 'services' | 'customers' | 'settings';
