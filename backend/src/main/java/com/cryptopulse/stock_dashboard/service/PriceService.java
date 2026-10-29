package com.cryptopulse.stock_dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class PriceService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private static final String BINANCE = "https://api.binance.com/api/v3/ticker/24hr?symbol=%sUSDT";

    public List<Map<String, Object>> getLivePrices() {
        List<Map<String, Object>> out = new ArrayList<>();
        String[] symbols = {"BTC", "ETH", "SOL"};
        for (String s : symbols) {
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
}