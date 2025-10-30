
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionDays: number;
  subscriptionEndDate: string;
  status: 'active' | 'expiring' | 'expired';
  lastUpdate: string;
  notes: string;
}

export interface UpdateMessage {
  clientId: string;
  message: string;
  timestamp: string;
}
