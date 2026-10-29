package com.cryptopulse.stock_dashboard.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    private final PriceService priceService;
    private final StockService stockService;

    public AnalyticsService(PriceService priceService, StockService stockService) {
        this.priceService = priceService;
        this.stockService = stockService;
    }

    // Pearson correlation between BTC and ETH recent price history (proxy for crypto-crypto correlation)
    public Map<String, Object> getCorrelation() {
        List<Double> btc = priceService.getBtcHistory();
        List<Double> eth = priceService.getEthHistory();
        Map<String, Object> out = new HashMap<>();
        int n = Math.min(btc.size(), eth.size());
        if (n < 5) {
            out.put("correlation", 0.0);
            out.put("samples", n);
            out.put("status", "collecting data");
            return out;
        }
        // align last n
        List<Double> a = btc.subList(btc.size() - n, btc.size());
        List<Double> b = eth.subList(eth.size() - n, eth.size());
        double r = pearson(a, b);
        out.put("correlation", Math.round(r * 1000.0) / 1000.0);
        out.put("samples", n);
        out.put("status", "ok");
        out.put("interpretation", r > 0.7 ? "strong positive" : r > 0.3 ? "moderate positive" : r < -0.7 ? "strong negative" : r < -0.3 ? "moderate negative" : "weak");
        return out;
    }

    // Simple linear-regression price forecast for BTC over next N steps (heuristic, not real ML)
    public Map<String, Object> forecastBtc(int steps) {
        List<Double> h = priceService.getBtcHistory();
        Map<String, Object> out = new HashMap<>();
        if (h.size() < 5) {
            out.put("forecast", h.isEmpty() ? 0 : h.get(h.size() - 1));
            out.put("status", "insufficient data");
            return out;
        }
        // linear regression on index -> price
        int n = h.size();
        double sx = 0, sy = 0, sxx = 0, sxy = 0;
        for (int i = 0; i < n; i++) {
            double x = i;
            double y = h.get(i);
            sx += x; sy += y; sxx += x * x; sxy += x * y;
        }
        double slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
        double intercept = (sy - slope * sx) / n;
        double last = h.get(n - 1);
        double forecast = intercept + slope * (n - 1 + steps);
        out.put("current", last);
        out.put("forecast", Math.round(forecast * 100.0) / 100.0);
        out.put("slope", Math.round(slope * 10000.0) / 10000.0);
        out.put("horizonSteps", steps);
        out.put("status", "heuristic (linear trend). Replace with LSTM/Transformer for production.");
        return out;
    }

    private double pearson(List<Double> x, List<Double> y) {
        int n = x.size();
        double mx = 0, my = 0;
        for (int i = 0; i < n; i++) { mx += x.get(i); my += y.get(i); }
        mx /= n; my /= n;
        double num = 0, dx = 0, dy = 0;
        for (int i = 0; i < n; i++) {
            double a = x.get(i) - mx;
            double b = y.get(i) - my;
            num += a * b;
            dx += a * a;
            dy += b * b;
        }
        if (dx == 0 || dy == 0) return 0;
        return num / Math.sqrt(dx * dy);
    }
}