import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../market.service';
import { WhaleService } from '../whale.service';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>🤖 AI Insights</h1>
      <p class="intro">Composite market signal combining sentiment, price action and whale activity (rule-based, heuristic).</p>
      <div class="signal" [class.bull]="signal==='BULLISH'" [class.bear]="signal==='BEARISH'" [class.neu]="signal==='NEUTRAL'">
        <div class="sig-label">Overall Signal</div>
        <div class="sig-value">{{ signal }}</div>
        <div class="sig-score">Confidence: {{ confidence }}%</div>
      </div>
      <div class="factors">
        <div class="factor"><span>Sentiment</span><span>{{ sentimentLabel }} ({{ sentimentScore }})</span></div>
        <div class="factor"><span>BTC 24h</span><span [class.up]="btcUp" [class.down]="!btcUp">{{ btcChange }}%</span></div>
        <div class="factor"><span>Whale Buy/Sell</span><span>{{ whaleRatio }}</span></div>
      </div>
      <div class="note">This is a heuristic signal for educational purposes only. Not financial advice. Real AI models (LSTM, transformers) can be plugged in via the backend.</div>
    </div>
  `,
  styles: [`.page{padding:24px;color:#eaecef}h1{margin:0 0 8px}.intro{color:#848e9c;margin-bottom:16px}.signal{border-radius:12px;padding:24px;text-align:center;margin-bottom:16px;border:1px solid #2b3139}.signal.bull{background:#0ecb8115;border-color:#0ecb81}.signal.bear{background:#f6465d15;border-color:#f6465d}.signal.neu{background:#fcd53515;border-color:#fcd535}.sig-label{font-size:12px;color:#848e9c;text-transform:uppercase}.sig-value{font-size:32px;font-weight:800;margin:8px 0}.sig-score{font-size:13px;color:#848e9c}.factors{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}.factor{display:flex;justify-content:space-between;background:#151a21;padding:12px 16px;border-radius:8px;border:1px solid #2b3139}.up{color:#0ecb81}.down{color:#f6465d}.note{color:#848e9c;font-size:12px;font-style:italic}`]
})
export class AiInsightsComponent implements OnInit {
  private ms = inject(MarketService);
  private ws = inject(WhaleService);
  signal = 'NEUTRAL';
  confidence = 50;
  sentimentLabel = 'Loading';
  sentimentScore = 0;
  btcChange = '0';
  btcUp = true;
  whaleRatio = '-';

  ngOnInit() {
    this.ms.getSentiment().subscribe((d: any) => {
      this.sentimentScore = d.score;
      this.sentimentLabel = d.label;
      this.compute();
    });
    this.ms.getLivePrices().subscribe((d: any[]) => {
      const btc = d.find((x: any) => x.symbol === 'BTC');
      if (btc) { this.btcChange = btc.change; this.btcUp = btc.up; }
      this.compute();
    });
    this.ws.getWhales().subscribe((d: any[]) => {
      const buys = d.filter((w: any) => w.type === 'Accumulated' || w.type === 'Minted').length;
      const sells = d.filter((w: any) => w.type === 'Dumped' || w.type === 'Burned').length;
      this.whaleRatio = `${buys} buy / ${sells} sell`;
      this.compute();
    });
  }

  private compute() {
    let score = 0;
    if (this.sentimentScore >= 55) score += 1; else if (this.sentimentScore < 45) score -= 1;
    if (this.btcUp) score += 1; else score -= 1;
    if (this.whaleRatio.startsWith('0 buy')) score -= 1;
    if (score >= 2) { this.signal = 'BULLISH'; this.confidence = 75; }
    else if (score <= -2) { this.signal = 'BEARISH'; this.confidence = 75; }
    else { this.signal = 'NEUTRAL'; this.confidence = 50; }
  }
}