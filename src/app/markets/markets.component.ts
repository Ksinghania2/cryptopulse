import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-markets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="head"><h1>Prediction Markets</h1><span class="live">LIVE</span></div>
      <p class="intro">Vote on crypto outcomes. Votes are persisted to the database.</p>
      <div class="list">
        <div *ngFor="let m of markets" class="card">
          <div class="q">{{ m.event }}</div>
          <div class="bars">
            <div class="bar yes" [style.width.%]="m.yesPercent" (click)="vote(m.id, true)">YES {{ m.yesPercent }}%</div>
            <div class="bar no" [style.width.%]="m.noPercent" (click)="vote(m.id, false)">NO {{ m.noPercent }}%</div>
          </div>
          <div class="vol">Vol: {{ m.volume }}</div>
        </div>
        <div *ngIf="!markets.length" class="empty">Loading markets...</div>
      </div>
    </div>
  `,
  styles: [`.page{padding:24px;color:#eaecef}h1{margin:0}.head{display:flex;align-items:center;gap:12px;margin-bottom:8px}.live{background:#f6465d;color:#fff;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:700}.intro{color:#848e9c;margin-bottom:16px}.list{display:flex;flex-direction:column;gap:12px;max-width:700px}.card{background:#151a21;border:1px solid #2b3139;border-radius:12px;padding:14px}.q{font-weight:600;margin-bottom:10px}.bars{display:flex;height:32px;background:#2b3139;border-radius:6px;overflow:hidden;cursor:pointer;margin-bottom:8px}.bar{display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;transition:width .3s}.bar.yes{background:#0ecb81}.bar.no{background:#f6465d}.vol{font-size:12px;color:#848e9c;text-align:right;font-family:monospace}.empty{color:#848e9c;padding:24px;text-align:center}`]
})
export class MarketsComponent implements OnInit {
  private ms: MarketService = inject(MarketService);
  private destroyRef = inject(DestroyRef);
  markets: any[] = [];
  ngOnInit() { this.load(); timer(30000, 30000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load()); }
  load() {
    this.ms.getPredictions().subscribe((data: any[]) => {
      this.markets = data.map(m => {
        const total = m.yesVotes + m.noVotes;
        const yesPercent = total === 0 ? 50 : Math.round((m.yesVotes / total) * 100);
        const noPercent = total === 0 ? 50 : 100 - yesPercent;
        return { ...m, yesPercent, noPercent };
      });
    });
  }
  vote(id: string, isYes: boolean) {
    this.ms.vote(id, isYes ? 'YES' : 'NO').subscribe((updated: any) => {
      const idx = this.markets.findIndex(m => m.id === updated.id);
      if (idx !== -1) {
        const total = updated.yesVotes + updated.noVotes;
        const yesPercent = total === 0 ? 50 : Math.round((updated.yesVotes / total) * 100);
        this.markets[idx] = { ...updated, yesPercent, noPercent: 100 - yesPercent };
      }
    });
  }
}