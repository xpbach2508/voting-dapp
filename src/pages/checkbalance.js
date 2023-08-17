
'use client'
import { useEffect, useState } from "react";

import Web3 from "web3";
import {
  tokenContractInstance,
  votingContractInstance,
} from "@/services/service";

import NavBar from '@/components/NavBar';
import { useConnection } from "@/services/ConnectionContext";

export default function Home() {
  const [web3, setWeb3] = useState(null);
  //const [address, setAddress] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [votingContract, setVotingContract] = useState(null);
  const [addressBalance, setAddressBalance] = useState(null);
  const [balanceOther, setBalanceOther] = useState(null);

  const { isConnected, setIsConnected , address, setAddress, balance, setBalance} = useConnection();


  const [errorMessage, setErrorMessage] = useState(null);

  const handleConnecttoWallet = async() => {
    if (typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const tokenContractIns = tokenContractInstance(web3Instance);
        setTokenContract(tokenContractIns);
        const votingContractIns = votingContractInstance(web3Instance);
        setVotingContract(votingContractIns);
        const balance = await tokenContract.methods.balanceOf(address).call();
        setBalance(web3.utils.fromWei(balance, "ether"));
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Not install Metamask Wallet (Extension)")
    };
  }


  const updateAddressBalance = (e) => {
    setAddressBalance(e.target.value);
  }

  const handleGetBalance = async() => {
    const balance = await tokenContract.methods.balanceOf(addressBalance).call();
    setBalanceOther(web3.utils.fromWei(balanceOther, "ether"));
  };

  return isConnected ? (
    <>
    <NavBar 
    handleConnecttoWallet={handleConnecttoWallet}
    />
    <main className="container">
      <section>
          <div className="field my-5"> 
            <label className="lable">Check the balance of a wallet address</label>
            <div className="controle mt-2">
              <input onChange={updateAddressBalance} className="input" type=" type" placeholder=" Enter wallet address to check..." />
            </div>
            <button onClick={handleGetBalance} className="button is-info mt-2" >Check</button>
          </div>
          <div className=" container has-text-success">
              {balanceOther && (
                <p>
                  The balance that address {addressBalance} has = {balanceOther}
                </p>
              )}
            </div>
      </section>
      
      <section>
        <div className="has-text-danger">
          <p>{errorMessage}</p>
        </div>
      </section>
    </main>
    </>
  ) : (
    <>
      <NavBar 
        handleConnecttoWallet={handleConnecttoWallet}
    />
    </>
  )
}
