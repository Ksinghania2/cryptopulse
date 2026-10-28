import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Video { id: string; title: string; channel: string; views: string; }

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>🎬 Crypto Videos</h1>
      <div class="video-grid">
        <div class="video-card" *ngFor="let v of videos">
          <div class="thumb">
            <iframe [src]="safe(v.id)" frameborder="0" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="vinfo">
            <div class="vtitle">{{ v.title }}</div>
            <div class="vmeta">{{ v.channel }} · {{ v.views }} views</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px; color: #eaecef; }
    h1 { margin: 0 0 16px; }
    .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .video-card { background: #151a21; border-radius: 12px; overflow: hidden; border: 1px solid #2b3139; }
    .thumb { position: relative; padding-bottom: 56.25%; height: 0; }
    .thumb iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
    .vinfo { padding: 12px; }
    .vtitle { font-weight: 600; margin-bottom: 4px; }
    .vmeta { font-size: 12px; color: #848e9c; }
  `]
})
export class VideosComponent {
  videos: Video[] = [
    { id: 'dQw4w9WgXcQ', title: 'Bitcoin Explained', channel: 'CryptoDaily', views: '1.2M' },
    { id: 'dQw4w9WgXcQ', title: 'Ethereum 2.0 Deep Dive', channel: 'Bankless', views: '840K' },
    { id: 'dQw4w9WgXcQ', title: 'DeFi in 2026', channel: 'CoinBureau', views: '620K' },
    { id: 'dQw4w9WgXcQ', title: 'Solana vs Ethereum', channel: 'Altcoin Daily', views: '1.5M' },
    { id: 'dQw4w9WgXcQ', title: 'Crypto Regulations Explained', channel: 'Bloomberg Crypto', views: '310K' },
    { id: 'dQw4w9WgXcQ', title: 'Whale Watching 101', channel: 'Whale Alert', views: '220K' },
  ];
  safe(id: string) { return `https://www.youtube.com/embed/${id}`; }
}