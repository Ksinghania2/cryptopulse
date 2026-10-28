import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface CryptoNews {
  title: string;
  link: string;
  date: string;
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  
  private binanceUrl = 'https://api.binance.com/api/v3/ticker/24hr';
  private javaUrl = 'http://localhost:8080/api'; // Base Java API URL

  constructor(private http: HttpClient) {}

  // --- FEATURE A: LIVE CRYPTO (Binance) ---
  getLivePrices(): Observable<any> {
    return timer(0, 3000).pipe(
      switchMap(() => {
        return forkJoin([
          this.http.get(`${this.binanceUrl}?symbol=BTCUSDT`),
          this.http.get(`${this.binanceUrl}?symbol=ETHUSDT`),
          this.http.get(`${this.binanceUrl}?symbol=SOLUSDT`)
        ]);
      }),
      map((responses: any[]) => {
        return [
          { symbol: 'BTC', price: parseFloat(responses[0].lastPrice).toFixed(2), change: parseFloat(responses[0].priceChangePercent).toFixed(2), up: parseFloat(responses[0].priceChangePercent) > 0 },
          { symbol: 'ETH', price: parseFloat(responses[1].lastPrice).toFixed(2), change: parseFloat(responses[1].priceChangePercent).toFixed(2), up: parseFloat(responses[1].priceChangePercent) > 0 },
          { symbol: 'SOL', price: parseFloat(responses[2].lastPrice).toFixed(2), change: parseFloat(responses[2].priceChangePercent).toFixed(2), up: parseFloat(responses[2].priceChangePercent) > 0 }
        ];
      })
    );
  }

  // --- FEATURE B: MACRO STOCKS (Java -> Yahoo) ---
  getMacroStocks(): Observable<any> {
    return this.http.get(`${this.javaUrl}/stocks/market-summary`);
  }

  // --- FEATURE C: FEAR & GREED INDEX (Java -> Alternative.me) ---
  getSentiment(): Observable<any> {
    return this.http.get(`${this.javaUrl}/stocks/sentiment`);
  }

  // --- FEATURE D: LIVE NEWS (Java -> Cointelegraph RSS) ---
  getNews(): Observable<CryptoNews[]> {
    return this.http.get<CryptoNews[]>(`${this.javaUrl}/news`);
  }

  // --- FEATURE E: PREDICTION MARKETS (Java -> Voting Engine) ---
  getPredictions(): Observable<any[]> {
    // Fixed Endpoint: Now points to the real database table
    return this.http.get<any[]>(`${this.javaUrl}/markets`);
  }

  vote(id: string, type: 'YES' | 'NO'): Observable<any> {
    // Fixed Endpoint: Matches your Java MarketController exactly
    return this.http.post(`${this.javaUrl}/markets/${id}/vote?type=${type}`, {});
  }
}