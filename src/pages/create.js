
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
  const { isConnected, setIsConnected , address, setAddress, balance, setBalance} = useConnection();


  const [errorMessage, setErrorMessage] = useState(null);
  const [description, setDescription] = useState(null);

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


  const updateDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmitProposal = async() => {
    try {
      const allowance = await tokenContract.methods.allowance(address, votingContract._address).call();
      if (Number(web3.utils.fromWei(allowance, "ether")) < 20) {
        await tokenContract.methods.approve(votingContract._address, BigInt(20 * 10 ** 18)).send({
          from: address
        });
      }
      await votingContract.methods.createProposal(description).send({
        from: address
      })
    } catch (error) {
      setErrorMessage(errorMessage);
    }
  }

  return isConnected ? (
    <>
    <NavBar 
    handleConnecttoWallet={handleConnecttoWallet}
    />
    <main className="container">
      <section>
          <div className="field my-5"> 
            <label className="lable">Create a poll for your community (Require 20 COM)</label>
            <div className="controle mt-2">
              <input onChange={updateDescription} className="input" type=" type" placeholder=" Enter proposal's description..." />
            </div>
            <button onClick={handleSubmitProposal} className="button is-info mt-2" >Create</button>
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
        <div className="has-text-danger">
          <p>Please connect Metamask wallet</p>
        </div>
      </section>
    </>
  )
}
