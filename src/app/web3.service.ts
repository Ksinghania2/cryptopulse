import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ethers } from 'ethers';

// Declare the global window object for MetaMask
declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private userAccount = new BehaviorSubject<any>(null);
  user$ = this.userAccount.asObservable();

  constructor() {}

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // 1. Request Access to MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // 2. Create Provider
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balanceRaw = await provider.getBalance(address);
        const balance = ethers.formatEther(balanceRaw);

        // 3. Update the App State
        this.userAccount.next({
          isConnected: true,
          address: address,
          balance: parseFloat(balance).toFixed(4), // Show 4 decimals
          repPoints: 500 // Starting Reputation for new users
        });

      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      alert('MetaMask not installed! Please install it to use CryptoStream Pro.');
    }
  }
}