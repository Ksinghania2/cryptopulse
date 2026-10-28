import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface WhaleTransaction {
  coinSymbol: string;
  type: string;
  amount: string;
  usdValue: string;
  walletAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class WhaleService {

  private apiUrl = environment.javaUrl + '/whales';

  constructor(private http: HttpClient) { }

  getWhales(): Observable<WhaleTransaction[]> {
    // Poll the Java Backend every 5 seconds
    return timer(0, 5000).pipe(
      switchMap(() => this.http.get<WhaleTransaction[]>(this.apiUrl))
    );
  }
}
