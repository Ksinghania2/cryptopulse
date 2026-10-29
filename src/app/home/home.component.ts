import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { WhaleService, WhaleTransaction } from '../whale.service';
import { MarketService, CryptoNews } from '../market.service';
import { Web3Service } from '../web3.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: '../app.component.scss'
})
export class HomeComponent implements OnInit {
  whaleService = inject(WhaleService);
  marketService = inject(MarketService);
  web3Service = inject(Web3Service);
  private destroyRef = inject(DestroyRef);

  whales: WhaleTransaction[] = [];
  cryptoMarket: any[] = [];
  stockMarket: any[] = [];
  sentiment = { score: 0, label: 'Loading...', trend: 'same' };
  newsArticles: CryptoNews[] = [];
  predictionMarkets: any[] = [];

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

  private categoryKeywords: Record<string, string[]> = {
    'Market Analysis': [],
    'Regulatory Updates': ['regulation', 'sec', 'etf', 'law', 'policy', 'court', 'ban'],
    'Blockchain Dev': ['blockchain', 'developer', 'protocol', 'upgrade', 'fork'],
    'Token News': ['token', 'coin', 'airdrop'],
    'Institutional': ['institutional', 'etf', 'fund', 'bank'],
    'Security & Fraud': ['hack', 'scam', 'fraud', 'security', 'exploit'],
    'DeFi & Web3': ['defi', 'web3', 'nft', 'dao'],
    'Mining': ['mining', 'miner', 'hashrate']
  };

  get filteredNews(): CryptoNews[] {
    const kw = this.categoryKeywords[this.selectedCategory] || [];
    if (!kw.length) return this.newsArticles;
    return this.newsArticles.filter(a => {
      const t = (a.title + ' ' + a.source).toLowerCase();
      return kw.some(k => t.includes(k));
    });
  }

  ngOnInit() {
    this.marketService.getLivePrices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.cryptoMarket = data);

    this.marketService.getMacroStocks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.stockMarket = data,
      error: (err) => console.error('Stock Error:', err)
    });

    this.marketService.getSentiment().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: any) => {
        this.sentiment = { score: data.score, label: data.label, trend: 'same' };
        this.isLoadingSentiment = false;
      },
      error: () => this.isLoadingSentiment = false
    });

    this.loadNews();
    timer(60000, 60000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadNews());

    this.loadPredictions();

    this.whaleService.getWhales().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.whales = data; this.isLoadingWhales = false;
    });

    this.web3Service.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(userData => { if (userData) this.user = userData; });
  }

  loadPredictions() {
    this.marketService.getPredictions().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.predictionMarkets = data.map((m: any) => this.formatMarket(m));
      this.isLoadingPredict = false;
    });
  }

  submitVote(marketId: string, isYes: boolean) {
    const voteType = isYes ? 'YES' : 'NO';
    this.marketService.vote(marketId, voteType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updatedMarket: any) => {
      const index = this.predictionMarkets.findIndex((m: any) => m.id === updatedMarket.id);
      if (index !== -1) this.predictionMarkets[index] = this.formatMarket(updatedMarket);
    });
  }

  loadNews() {
    this.marketService.getNews().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.newsArticles = data; this.isLoadingNews = false; },
      error: () => this.isLoadingNews = false
    });
  }

  private formatMarket(market: any) {
    const total = market.yesVotes + market.noVotes;
    const yesPercent = total === 0 ? 50 : Math.round((market.yesVotes / total) * 100);
    const noPercent = total === 0 ? 50 : 100 - yesPercent;
    return { ...market, yesPercent, noPercent };
  }

  connectWallet() { this.web3Service.connectWallet(); }
  selectCategory(name: string) { this.selectedCategory = name; }
}