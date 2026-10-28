import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { WhaleService, WhaleTransaction } from '../whale.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="head"><h1>Whale Movements</h1><span class="live">LIVE</span></div>
      <p class="intro">Large on-chain transactions detected across major assets.</p>
      <div class="list">
        <div *ngFor="let w of whales" class="card">
          <div class="row"><span class="coin">{{ w.coinSymbol }}</span><span class="type" [class.buy]="w.type==='Accumulated'||w.type==='Minted'" [class.sell]="w.type==='Dumped'||w.type==='Burned'">{{ w.type }}</span></div>
          <div class="amount">{{ w.amount }} {{ w.coinSymbol }}</div>
          <div class="value">{{ w.usdValue }}</div>
          <div class="wallet">from {{ w.walletAddress | slice:0:10 }}...</div>
        </div>
        <div *ngIf="!whales.length" class="empty">Loading movements...</div>
      </div>
    </div>
  `,
  styles: [`.page{padding:24px;color:#eaecef}h1{margin:0}.head{display:flex;align-items:center;gap:12px;margin-bottom:8px}.live{background:#f6465d;color:#fff;font-size:11px;padding:2px 8px;border-radius:999px;font-weight:700}.intro{color:#848e9c;margin-bottom:16px}.list{display:flex;flex-direction:column;gap:12px}.card{background:#151a21;border:1px solid #2b3139;border-radius:12px;padding:14px}.row{display:flex;justify-content:space-between;margin-bottom:8px}.coin{font-weight:700}.type{font-size:12px;padding:2px 8px;border-radius:999px}.type.buy{background:#0ecb8122;color:#0ecb81}.type.sell{background:#f6465d22;color:#f6465d}.amount{font-size:18px;font-weight:700}.value{color:#848e9c;font-size:13px}.wallet{color:#848e9c;font-size:12px;margin-top:6px;font-family:monospace}.empty{color:#848e9c;padding:24px;text-align:center}`]
})
export class MovementsComponent implements OnInit {
  private ws: WhaleService = inject(WhaleService);
  private destroyRef = inject(DestroyRef);
  whales: WhaleTransaction[] = [];
  ngOnInit() {
    this.load();
    timer(10000, 10000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
  }
  load() { this.ws.getWhales().subscribe(d => this.whales = d); }
}