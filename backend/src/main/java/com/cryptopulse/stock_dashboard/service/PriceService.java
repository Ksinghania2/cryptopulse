package com.cryptopulse.stock_dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class PriceService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private static final String BINANCE = "https://api.binance.com/api/v3/ticker/24hr?symbol=%sUSDT";

    // In-memory ring buffers for correlation / prediction
    private final Deque<Double> btcHistory = new ConcurrentLinkedDeque<>();
    private final Deque<Double> ethHistory = new ConcurrentLinkedDeque<>();
    private static final int MAX_HISTORY = 60;

    public List<Map<String, Object>> getLivePrices() {
        List<Map<String, Object>> out = new ArrayList<>();
        String[] symbols = {"BTC", "ETH", "SOL"};
        for (int i = 0; i < symbols.length; i++) {
            String s = symbols[i];
            try {
                String body = restTemplate.getForObject(String.format(BINANCE, s), String.class);
                JsonNode n = mapper.readTree(body);
                double last = n.path("lastPrice").asDouble();
                double pct = n.path("priceChangePercent").asDouble();
                Map<String, Object> m = new HashMap<>();
                m.put("symbol", s);
                m.put("price", String.format("%.2f", last));
                m.put("change", String.format("%.2f", pct));
                m.put("up", pct > 0);
                out.add(m);
                if (i == 0) push(btcHistory, last);
                if (i == 1) push(ethHistory, last);
            } catch (Exception e) {
                Map<String, Object> m = new HashMap<>();
                m.put("symbol", s);
                m.put("price", "---");
                m.put("change", "0.00");
                m.put("up", true);
                out.add(m);
            }
        }
        return out;
    }

    private void push(Deque<Double> dq, double v) {
        dq.addLast(v);
        while (dq.size() > MAX_HISTORY) dq.pollFirst();
    }

    public List<Double> getBtcHistory() { return new ArrayList<>(btcHistory); }
    public List<Double> getEthHistory() { return new ArrayList<>(ethHistory); }
}