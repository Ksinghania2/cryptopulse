# CryptoPulse — Product Roadmap & Ideas

## Vision
A YouTube-like platform for crypto: news, videos, charts, regulations, and on-chain movements in one place, with AI-assisted insights.

## Current (shipped)
- Live price/macro tickers, sentiment (Fear & Greed), Cointelegraph news feed
- Whale movement feed (auto-refresh)
- Prediction markets with persistent voting
- Crypto video feed from reputable channels (Coin Bureau, Bankless, Whiteboard Crypto, Altcoin Daily) via RSS, auto-refresh
- Interactive charts (TradingView)
- Regulations feed (news filtered by regulatory keywords)
- AI Insights panel (heuristic signal combining sentiment + price + whale activity)
- MetaMask wallet connect with account/chain change handling

## Proposed: AI / Stock / Deep Learning enhancements

### 1. AI News Summarization & Sentiment
- Backend: integrate an LLM (OpenAI/Claude/Gemini) to summarize each news article and score sentiment (-1..+1).
- Store embeddings in pgvector (already using pgvector image) for semantic search.
- Frontend: show AI summary + sentiment badge on each news card; "Ask AI" chat over news.

### 2. Price Prediction (Deep Learning)
- Backend: Python microservice (FastAPI) running LSTM/Transformer models trained on Binance klines.
- Expose /api/predictions/price?symbol=BTC&horizon=24h returning forecast + confidence band.
- Frontend: overlay forecast on the TradingView chart; show model accuracy metrics.
- Retrain nightly via scheduled job; store predictions in Postgres for backtesting.

### 3. Stock-Crypto Correlation Dashboard
- Combine macro stock tickers (S&P, NASDAQ, Gold) with crypto prices; compute rolling correlation.
- Surface "risk-on/risk-off" regime detection; alert when correlation breaks down.

### 4. On-Chain Movement Intelligence
- Replace synthetic whale data with real feeds (Whale Alert API, Etherscan, Arkham).
- Cluster wallets, detect accumulation/distribution patterns, flag smart-money flows.
- AI anomaly detection on transaction volume (isolation forest / autoencoder).

### 5. Regulatory Intelligence
- Ingest SEC/ESMA/FCA RSS + enforcement actions; classify by impact (high/medium/low) via NLP.
- Per-asset regulatory timeline; alerts for tokens affected by new rules.

### 6. Personalization & Recommendations
- User accounts (JWT auth) with watch history; recommend videos/news via collaborative filtering.
- "For You" feed ranked by engagement + sentiment alignment.

### 7. Real-time Streaming
- Replace polling with WebSockets (Spring WebSocket/STOMP) for prices, whales, news.
- Lower latency, reduce server load.

### 8. Video Platform Features (YouTube-like)
- Upload pipeline (S3 + transcoding), comments, likes, subscriptions, playlists, channels.
- Search across titles/transcripts (Elasticsearch + Whisper transcription).

### 9. Risk & Portfolio Tools
- Portfolio tracker (connected wallet balances across chains).
- VaR / drawdown analytics; tax reporting export.

### 10. Infrastructure / Production
- Dockerize Spring Boot + Angular; CI/CD (GitHub Actions); observability (Prometheus/Grafana).
- Rate limiting, caching (Redis), CDN for assets, horizontal scaling.

## Suggested priority (next 2 sprints)
1. Real whale feed (Whale Alert) + remove synthetic data.
2. LLM news summarization + sentiment (highest user value, lowest effort).
3. Price prediction microservice (LSTM) behind a feature flag.
4. WebSocket streaming for prices.
5. User auth + personalization.