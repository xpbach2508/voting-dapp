'use client';

import { use, useState } from "react";
import Link from 'next/link'

import Web3 from "web3";
import {
  tokenContractInstance,
  votingContractInstance,
} from "@/services/service";

import { useConnection } from "@/services/ConnectionContext";


export default function NavBar({handleConnecttoWallet}) {
  const { isConnected, setIsConnected , address, setAddress, balance, setBalance} = useConnection();

  const ConnecttoWallet = () => {
    handleConnecttoWallet();
  };

  return (
    <>
    <nav className="navbar is-light">
      <div className="container">
      <div className="navbar-brand">
        <div className="navbar-item">
          <p className="is-size-5 has-text-weight-semibold">VEASE</p>
        </div>
      </div>

      <div className="navbar-menu" id="nav-links">
        <div className="navbar-start">
          <Link href="/" className="navbar-item">Home</Link>
          <Link href="/checkbalance" className="navbar-item">Check Balance</Link>
          <Link href="/create" className="navbar-item">Create</Link>
          <Link href="/deposit" className="navbar-item">Deposit</Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div>
            {isConnected ? (<p>Wallet address: {address.slice(0,5)}...{address.slice(-4)}</p>) : 
            (<button className="button is-link" onClick={ConnecttoWallet}>Connect Wallet</button>)
            }
            </div>
          </div>
        </div>
      </div>
      </div>
    </nav>
    </>
  )
}