import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketService, CryptoNews } from '../market.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>📰 Crypto News</h1>
      <input class="search" [(ngModel)]="q" placeholder="Search news..." />
      <div class="list">
        <a *ngFor="let a of filtered" [href]="a.link" target="_blank" class="card">
          <div class="meta">{{ a.source }} · {{ a.date }}</div>
          <div class="title">{{ a.title }}</div>
        </a>
        <div *ngIf="!filtered.length" class="empty">No articles match.</div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; color: #eaecef; }
    h1 { margin: 0 0 16px; }
    .search { width: 100%; max-width: 400px; padding: 10px 14px; background: #151a21; border: 1px solid #2b3139; border-radius: 20px; color: #eaecef; margin-bottom: 16px; }
    .list { display: flex; flex-direction: column; gap: 12px; }
    .card { background: #151a21; border: 1px solid #2b3139; border-radius: 12px; padding: 14px; text-decoration: none; color: #eaecef; transition: border-color .2s; }
    .card:hover { border-color: #3772ff; }
    .meta { font-size: 12px; color: #848e9c; margin-bottom: 6px; }
    .title { font-weight: 600; }
    .empty { color: #848e9c; padding: 24px; text-align: center; }
  `]
})
export class NewsComponent implements OnInit {
  private ms = inject(MarketService);
  articles: CryptoNews[] = [];
  q = '';

  ngOnInit() { this.ms.getNews().subscribe(d => this.articles = d); }

  get filtered() {
    const q = this.q.toLowerCase();
    return this.articles.filter(a => !q || a.title.toLowerCase().includes(q) || a.source.toLowerCase().includes(q));
  }
}