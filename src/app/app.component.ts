import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  web3Service = inject(Web3Service);
  user = { isConnected: false, address: '', balance: '0', repPoints: 0 };

  constructor() {
    this.web3Service.user$.subscribe(u => { if (u) this.user = u; });
  }

  connectWallet() { this.web3Service.connectWallet(); }
}
