import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { timer } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>📊 AI Analytics</h1>
      <div class="grid">
        <div class="card">
          <h3>BTC ↔ ETH Correlation</h3>
          <div class="big">{{ corr?.correlation ?? '...' }}</div>
          <div class="sub">{{ corr?.interpretation }} · {{ corr?.samples }} samples</div>
          <div class="sub">{{ corr?.status }}</div>
        </div>
        <div class="card">
          <h3>BTC Price Forecast</h3>
          <div class="big">{{ forecast?.forecast ?? '...' }}</div>
          <div class="sub">Current: {{ forecast?.current }} · slope: {{ forecast?.slope }}</div>
          <div class="sub">Horizon: {{ forecast?.horizonSteps }} steps</div>
          <div class="note">{{ forecast?.status }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`.page{padding:24px;color:#eaecef}h1{margin:0 0 16px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}.card{background:#151a21;border:1px solid #2b3139;border-radius:12px;padding:20px}.card h3{margin:0 0 12px;color:#848e9c;font-size:13px;text-transform:uppercase}.big{font-size:36px;font-weight:800;margin:8px 0}.sub{font-size:13px;color:#848e9c;margin-top:4px}.note{font-size:11px;color:#848e9c;font-style:italic;margin-top:8px}`]
})
export class AnalyticsComponent implements OnInit {
  private http = inject(HttpClient);
  corr: any = null;
  forecast: any = null;
  ngOnInit() {
    this.load();
    timer(30000, 30000).subscribe(() => this.load());
  }
  load() {
    this.http.get<any>(`${environment.javaUrl}/analytics/correlation`).subscribe(d => this.corr = d);
    this.http.get<any>(`${environment.javaUrl}/analytics/forecast?steps=5`).subscribe(d => this.forecast = d);
  }
}