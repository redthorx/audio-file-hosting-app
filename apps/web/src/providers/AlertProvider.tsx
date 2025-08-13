import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AlertType = 'success' | 'danger' | 'info' | 'warning';

export interface AlertMessage {
  type: AlertType;
  message: string;
}

interface AlertContextProps {
  alert: AlertMessage | null;
  pushAlert: (alert: AlertMessage) => void;
  removeAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertMessage|null>(null);

  const pushAlert = (alert: AlertMessage) => setAlert(alert);
  const removeAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, pushAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};