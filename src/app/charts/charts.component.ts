import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>📈 Crypto Charts</h1>
      <div class="controls">
        <label>Symbol:</label>
        <select [(ngModel)]="symbol" (change)="reload()">
          <option *ngFor="let s of symbols" [value]="s">{{ s }}</option>
        </select>
        <label>Interval:</label>
        <select [(ngModel)]="interval" (change)="reload()">
          <option value="1">1m</option>
          <option value="5">5m</option>
          <option value="15">15m</option>
          <option value="60">1h</option>
          <option value="D">1D</option>
        </select>
      </div>
      <div class="chart-wrap">
        <iframe [src]="widgetUrl" frameborder="0" allowtransparency="true" scrolling="no"></iframe>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; color: #eaecef; }
    h1 { margin: 0 0 16px; }
    .controls { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    select { background: #151a21; color: #eaecef; border: 1px solid #2b3139; padding: 6px 10px; border-radius: 6px; }
    .chart-wrap { height: 70vh; border: 1px solid #2b3139; border-radius: 12px; overflow: hidden; }
    .chart-wrap iframe { width: 100%; height: 100%; border: 0; }
  `]
})
export class ChartsComponent {
  symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'];
  symbol = 'BTCUSDT';
  interval = '60';

  get widgetUrl() {
    return `https://s.tradingview.com/widgetembed/?frameElementId=tv&symbol=BINANCE:${this.symbol}&interval=${this.interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=fcd535&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1`;
  }

  reload() {}
}