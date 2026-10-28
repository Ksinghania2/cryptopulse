import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService, CryptoNews } from '../market.service';

const REG_KEYWORDS = ['regulation', 'sec', 'etf', 'law', 'ban', 'compliance', 'policy', 'government', 'court', 'lawsuit', 'approve', 'reject'];

@Component({
  selector: 'app-regulations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>⚖️ Crypto Regulations</h1>
      <p class="intro">Regulatory news and policy updates affecting the crypto industry.</p>
      <div class="list">
        <a *ngFor="let a of regs" [href]="a.link" target="_blank" class="card">
          <div class="meta">{{ a.source }} · {{ a.date }}</div>
          <div class="title">{{ a.title }}</div>
          <span class="tag">Regulation</span>
        </a>
        <div *ngIf="!regs.length" class="empty">Loading regulatory updates...</div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; color: #eaecef; }
    h1 { margin: 0 0 8px; }
    .intro { color: #848e9c; margin-bottom: 16px; }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .card { background: #151a21; border: 1px solid #2b3139; border-radius: 12px; padding: 14px; text-decoration: none; color: #eaecef; position: relative; }
    .card:hover { border-color: #3772ff; }
    .meta { font-size: 12px; color: #848e9c; margin-bottom: 6px; }
    .title { font-weight: 600; padding-right: 90px; }
    .tag { position: absolute; top: 14px; right: 14px; background: #3772ff22; color: #3772ff; font-size: 11px; padding: 2px 8px; border-radius: 999px; }
    .empty { color: #848e9c; padding: 24px; text-align: center; }
  `]
})
export class RegulationsComponent implements OnInit {
  private ms: MarketService = inject(MarketService);
  regs: CryptoNews[] = [];

  ngOnInit() {
    this.ms.getNews().subscribe((list: CryptoNews[]) => {
      this.regs = list.filter((a: CryptoNews) => {
        const t = a.title.toLowerCase();
        return REG_KEYWORDS.some(k => t.includes(k));
      });
      // fallback: if filter too strict, show all news
      if (this.regs.length === 0) this.regs = list;
    });
  }
}