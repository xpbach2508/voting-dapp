import { createContext, useContext, useState } from 'react';

const CombinedContext = createContext();

export function CombinedProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);

  return (
    <CombinedContext.Provider value={{ isConnected, setIsConnected, address, setAddress , balance, setBalance}}>
      {children}
    </CombinedContext.Provider>
  );
}

export function useConnection() {
  return useContext(CombinedContext);
}
