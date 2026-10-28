import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { WhaleService, WhaleTransaction } from './whale.service';
import { MarketService, CryptoNews } from './market.service';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  whaleService = inject(WhaleService);
  marketService = inject(MarketService);
  web3Service = inject(Web3Service);
  private destroyRef = inject(DestroyRef);
  
  // --- DATA ---
  whales: WhaleTransaction[] = [];
  cryptoMarket: any[] = [];
  stockMarket: any[] = [];
  sentiment = { score: 0, label: 'Loading...', trend: 'same' }; 
  newsArticles: CryptoNews[] = [];
  predictionMarkets: any[] = [];

  // --- LOADING STATES ---
  isLoadingNews = true;
  isLoadingWhales = true;
  isLoadingSentiment = true;
  isLoadingPredict = true;

  user = { isConnected: false, address: '', balance: '0', repPoints: 0 };
  
  categories = [
    { icon: '📊', name: 'Market Analysis' },
    { icon: '⚖️', name: 'Regulatory Updates' },
    { icon: '⛓️', name: 'Blockchain Dev' },
    { icon: '🪙', name: 'Token News' },
    { icon: '🏦', name: 'Institutional' },
    { icon: '🛡️', name: 'Security & Fraud' },
    { icon: '🌐', name: 'DeFi & Web3' },
    { icon: '⛏️', name: 'Mining' }
  ];

  selectedCategory = 'Market Analysis';
  activeRightTab = 'whales';

  ngOnInit() {
    this.marketService.getLivePrices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.cryptoMarket = data);
    
    this.marketService.getMacroStocks().subscribe({
      next: (data) => this.stockMarket = data,
      error: (err) => console.error('Stock Error:', err)
    });

    this.marketService.getSentiment().subscribe({
      next: (data: any) => {
        this.sentiment = { score: data.score, label: data.label, trend: 'down' };
        this.isLoadingSentiment = false;
      },
      error: () => this.isLoadingSentiment = false
    });

    this.marketService.getNews().subscribe({
      next: (data) => {
        this.newsArticles = data;
        this.isLoadingNews = false;
      },
      error: () => this.isLoadingNews = false
    });

    // Load predictions from DB
    this.loadPredictions();

    this.whaleService.getWhales().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.whales = data;
      this.isLoadingWhales = false;
    });

    this.web3Service.user$.subscribe(userData => { if (userData) this.user = userData; });
  }

  loadPredictions() {
    this.marketService.getPredictions().subscribe(data => {
      // Calculate percentages for the UI
      this.predictionMarkets = data.map(market => this.formatMarket(market));
      this.isLoadingPredict = false;
    });
  }

  submitVote(marketId: string, isYes: boolean) {
    const voteType = isYes ? 'YES' : 'NO';
    this.marketService.vote(marketId, voteType).subscribe(updatedMarket => {
      const index = this.predictionMarkets.findIndex(m => m.id === updatedMarket.id);
      if (index !== -1) {
        // Recalculate percentages instantly when the database updates
        this.predictionMarkets[index] = this.formatMarket(updatedMarket);
      }
    });
  }

  // Helper method: Translates database numbers into UI percentages
  private formatMarket(market: any) {
    const total = market.yesVotes + market.noVotes;
    const yesPercent = total === 0 ? 50 : Math.round((market.yesVotes / total) * 100);
    const noPercent = total === 0 ? 50 : 100 - yesPercent;
    return { ...market, yesPercent, noPercent };
  }

  connectWallet() { this.web3Service.connectWallet(); }
  selectCategory(name: string) { this.selectedCategory = name; }
}
