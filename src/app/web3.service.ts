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

  constructor() {
    // React to MetaMask account/chain changes if the provider is available.
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          this.userAccount.next({ isConnected: false, address: '', balance: '0', repPoints: 0 });
        } else {
          this.refreshAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Reload to pick up the new chain's state cleanly.
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      });

      window.ethereum.on('disconnect', () => {
        this.userAccount.next({ isConnected: false, address: '', balance: '0', repPoints: 0 });
      });
    }
  }

  async connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // 1. Request Access to MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        await this.refreshAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      alert('MetaMask not installed! Please install it to use CryptoStream Pro.');
    }
  }

  private async refreshAccount(address: string) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const resolvedAddress = await signer.getAddress();
      const balanceRaw = await provider.getBalance(resolvedAddress);
      const balance = ethers.formatEther(balanceRaw);

      this.userAccount.next({
        isConnected: true,
        address: resolvedAddress,
        balance: parseFloat(balance).toFixed(4),
        repPoints: 500 // Starting Reputation for new users
      });
    } catch (error) {
      console.error('Failed to refresh account', error);
    }
  }
}