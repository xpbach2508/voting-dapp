import Head from 'next/head';
import Image from 'next/image'
import "bulma/css/bulma.css";
import Web3 from 'web3'
import styles from '../styles/Home.module.css'
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

import Proposal from "../components/Proposal";
import NavBar from '../components/NavBar';
import { tokenContractInstance, votingContractInstance } from '@/services/service';
import { useConnection } from '@/services/ConnectionContext';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  //const [web3, setWeb3] = useState(null);
  //const [address, setAddress] = useState(null);
  const { isConnected, setIsConnected , 
    address, setAddress, 
    balance, setBalance, 
    votingContract, setVotingContract,
    tokenContract, setTokenContract,
    web3, setWeb3} = useConnection();
  const [errorMessage, setErrorMessage] = useState(null);
  const [countProposal, setCount] = useState(null);


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

  useEffect(() => {
    async function fetchData(){
      // if(isConnected!= true && !web3) {
      //   handleConnecttoWallet();
      // }
      if (votingContract) {
         const proposalCount = await votingContract.methods.proposalCount().call();
         setCount(Number(proposalCount));
      }
    }
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  })

  return (
    <>
    <Head>
      <title>Vease</title>
      <meta name="description" content="Voting with ease" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <NavBar 
    handleConnecttoWallet={handleConnecttoWallet}
    />
    <main className="container">
      <section className="my-5">
        <p className="is-size-1 has-text-centered">VOTING LIST ({countProposal})</p>
        <p className="has-text-centered mb-5">(Voting require 20 COM)</p>
        <div className="columns is-multiline">
          {countProposal > 0 &&
            Array.from({ length: countProposal }, (_, index) => {
              return (
                <Proposal
                  votingContract={votingContract}
                  address={address}
                  id={index}
                  key={index}
                  web3={web3}
                />
              );
            })}
        </div>
      </section>

      
      <section>
        <div className="has-text-danger">
          <p>{errorMessage}</p>
        </div>
      </section>
    </main>
    </>
  )
  
}
