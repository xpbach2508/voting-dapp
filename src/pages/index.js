import Head from 'next/head';
import Image from 'next/image'
import "bulma/css/bulma.css";
import Web3 from 'web3'
import styles from '../styles/Home.module.css'
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';

import Proposal from "../components/Proposal";
import { tokenContractInstance, votingContractInstance } from '@/services/service';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [votingContract, setVotingContract] = useState(null);
  const [addressBalance, setAddressBalance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amountDeposit, setAmountDeposit] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [description, setDescription] = useState(null);
  const [countProposal, setCount] = useState(null);

  const updateDescription = (e) => {
    setDescription(e.target.value);
  }
  const updateAmountDeposit = (e) => {
    setAmountDeposit(e.target.value);
  }
  const updateAddressBalance = (e) => {
    setAddressBalance(e.target.value);
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

  const handleGetBalance = async() => {
    const balance = await tokenContract.methods.balanceOf(addressBalance).call();
    setBalance(web3.utils.fromWei(balance, "ether"));
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
  }

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

  useEffect(() => {
    async function fetchData(){
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
    <div className={styles.container}>
      <Head>
        <title>Vease</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <nav className=" navbar mt-4 mb4">
          <div className=" container content">
            <div className=" navbar-brand">
              <h1 className=" ">Voting at ease</h1>
            </div>
            <div className=" navbar-end">
              <button
                className="button is-primary "
                onClick={handleConnecttoWallet}
              >
                Connect to Metamask Wallet
              </button>
            </div>
          </div>
        </nav>
        <section>
          <div className=" container mt-2">
            <p>Current account: {address}</p>
          </div>
        </section>

        <section>
          <div className=" container">
            <div className=" field">
              <label className=" lable">Balance of </label>
              <div className=" control">
                <input
                  className=" input"
                  type="type"
                  placeholder="Enter address to check balance..  "
                  onChange={updateAddressBalance}
                ></input>
              </div>
              <button
                onClick={handleGetBalance}
                className=" button is-primary mt-2"
              >
                Get balance
              </button>
            </div>
            <div className=" container has-text-success">
              {balance && (
                <p>
                  The balance that address {addressBalance} has = {balance}
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className=" container">
            <div className=" field">
              <label className=" lable">Deposit</label>
              <div className=" controle mt-2">
                <input
                  onChange={updateAmountDeposit}
                  className=" input"
                  type=" type"
                  placeholder=" Enter amount to deposit..."
                />
              </div>
              <button
                onClick={handleDeposit}
                className=" button is-primary mt-2"
              >
                Deposit
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className=" container">
            <div className=" field">
              <label className=" lable">
                Create a proposal
              </label>
              <div className=" controle mt-2">
                <input
                  onChange={updateDescription}
                  className=" input"
                  type=" type"
                  placeholder=" Enter proposal's description..."
                />
              </div>
              <button
                onClick={handleSubmitProposal}
                className=" button is-primary mt-2"
              >
                Submit
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className=" container mb-5">
            <div className=" field">
              <label>List Proposal: {countProposal}</label>
              <div>
                {countProposal>0 &&
                  Array.from({ length: countProposal }, (_, index) => {
                    return (
                      <Proposal
                        votingContract={votingContract}
                        address={address}
                        id={index}
                        key={index}
                        web3={web3}
                      ></Proposal>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className=" container has-text-danger">
            <p>{errorMessage}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
