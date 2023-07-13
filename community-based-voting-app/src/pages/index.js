import Head from 'next/head';
import Image from 'next/image'
import "bulma/css/bulma.css";
import Web3 from 'web3'
import styles from '../styles/Home.module.css'
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { tokenContractInstance, votingContractInstance } from '@/services/service';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [votingContract, setVotingContract] = useState(null);

  const handleConnecttoWallet = async() => {
    if (typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth-requestAccounts"
        })
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3.eth.getAccounts();
        setAddress(accounts[0]);
        
        const tokenContractIns = tokenContractInstance(web3Instance);
        setTokenContract(tokenContractIns);
        const votingContractIns = votingContractInstance(web3Instance);
        setVotingContract(votingContractIns);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Not install Metamask Wallet (Extension)")
    };
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Voting app</title>
        <link rel="icon" href='/favicon.ico'/>
      </Head>
      <main className={styles.main}>
        <nav className='navbar mt-4 mb4'>
          <div className='container'>
            <div className=' navbar-brand'>
              <h1>Dapp Voting</h1>
            </div>
            <div>
              <button className='button is-primary' onClick={handleConnecttoWallet}>
                Connect to Metamask Wallet
              </button>
            </div>
          </div>
        </nav>
        <section>
          <div className='container mt-2'>
            <p>{address}</p>
          </div>
        </section>
        
        <section>
          <div className='container'>
            <div className='field'>
              <label className='label'>Balance of</label>
              <div className='control'>
                <input className='input' type='type' placeholder='Enter address to check balance...' onChange={updateAddressBalance}> 
                </input>
              </div>
              <button onClick={handleGetBalance} className='button is-primary mt-2'>Get balance</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
