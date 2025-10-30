
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types/Client';
import { mockClients } from '@/data/mockClients';

interface ClientContextType {
  clients: Client[];
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  getClientById: (clientId: string) => Client | undefined;
  sendUpdateMessage: (clientId: string, message: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(mockClients);

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    console.log('Updating client:', clientId, updates);
    setClients(prevClients =>
      prevClients.map(client => {
        if (client.id === clientId) {
          const updatedClient = { ...client, ...updates, lastUpdate: new Date().toISOString() };
          
          // Recalculate status based on days
          if (updates.subscriptionDays !== undefined) {
            const days = updates.subscriptionDays;
            if (days <= 0) {
              updatedClient.status = 'expired';
            } else if (days <= 7) {
              updatedClient.status = 'expiring';
            } else {
              updatedClient.status = 'active';
            }
            
            // Update end date
            updatedClient.subscriptionEndDate = new Date(
              Date.now() + days * 24 * 60 * 60 * 1000
            ).toISOString();
          }
          
          return updatedClient;
        }
        return client;
      })
    );
  };

  const getClientById = (clientId: string): Client | undefined => {
    return clients.find(client => client.id === clientId);
  };

  const sendUpdateMessage = (clientId: string, message: string) => {
    console.log('Sending update message to client:', clientId, message);
    // In production, this would send an email/SMS
    // For now, we'll just update the notes
    updateClient(clientId, {
      notes: `${message} (Sent: ${new Date().toLocaleString()})`,
    });
  };

  return (
    <ClientContext.Provider value={{ clients, updateClient, getClientById, sendUpdateMessage }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
}
