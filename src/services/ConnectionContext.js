import { createContext, useContext, useState } from 'react';

const CombinedContext = createContext();

export function CombinedProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [votingContract, setVotingContract] = useState(null);

  return (
    <CombinedContext.Provider value={{ isConnected, setIsConnected, 
    address, setAddress , 
    balance, setBalance, 
    tokenContract, setTokenContract,
    votingContract, setVotingContract,
    web3, setWeb3}}>
      {children}
    </CombinedContext.Provider>
  );
}

export function useConnection() {
  return useContext(CombinedContext);
}
