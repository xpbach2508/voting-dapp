'use client'

import { useEffect, useState } from "react";

import Web3 from "web3";
import {
  tokenContractInstance,
  votingContractInstance,
} from "@/services/service";
import { useConnection } from "@/services/ConnectionContext";

import NavBar from '@/components/NavBar';

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [amountDeposit, setAmountDeposit] = useState(null);
  const { isConnected, setIsConnected , address, setAddress, balance, setBalance} = useConnection();

  const [errorMessage, setErrorMessage] = useState(null);

  const updateAmountDeposit = (e) => {
    setAmountDeposit(e.target.value);
  }

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


  const handleDeposit = async() => {
    try {
      await tokenContract.methods.deposit().send({
        from : address,
        value: Number(amountDeposit) * 10 ** 18,
      })
      
    } catch (error) {
      setErrorMessage(error.message);
    }
    const balance = await tokenContract.methods.balanceOf(address).call();
    setBalance(web3.utils.fromWei(balance, "ether"));
  }
  const updateBalance = async() =>{
    const balance = await tokenContract.methods.balanceOf(address).call();
    setBalance(web3.utils.fromWei(balance, "ether"));
    return balance;
  }

  return isConnected ? (
    <>
      <NavBar 
        handleConnecttoWallet={handleConnecttoWallet}
      />
      <main className="container">
        <section className="my-5" >
            <p>Your balance: {updateBalance} COM (Community Token)</p>
        </section>

        <section>
          <div className=" field my-5">
            <label className=" lable">Enter your amoutn of KLAY you want to deposit (0.1 KLAY = 1000 COM)</label>
            <div className=" controle mt-2">
              <input onChange={updateAmountDeposit} className=" input" type=" type" placeholder=" Enter a number..."/>
            </div>
            <button onClick={handleDeposit} className=" button is-info mt-2">Deposit</button>
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
      <section>
        <div className="has-text-danger text-center">
          <p>Please connect wallet</p>
        </div>
      </section>
    </>
  )
}
