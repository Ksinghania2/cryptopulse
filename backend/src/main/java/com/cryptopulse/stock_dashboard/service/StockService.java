package com.cryptopulse.stock_dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockService {

    private static final Logger logger = LoggerFactory.getLogger(StockService.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Yahoo Finance "Unofficial" Endpoint
    private final String YAHOO_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d";

    // 1. MACRO TICKER (Yahoo Finance)
    // @Cacheable: If this method was called less than 5 mins ago, return the saved result instantly.
    // If not, run the code, fetch from Yahoo, and save the result for next time.
    @Cacheable("marketSummary")
    public List<Map<String, Object>> getMarketSummary() {
        logger.info("Fetching REAL data from Yahoo Finance (Not Cached)...");
        
        List<Map<String, Object>> marketData = new ArrayList<>();
        String[] symbols = {"^GSPC", "^IXIC", "GC=F"}; // S&P 500, NASDAQ, GOLD
        String[] names = {"S&P 500", "NASDAQ", "GOLD"};

        // Disguise headers to mimic Chrome
        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        for (int i = 0; i < symbols.length; i++) {
            try {
                String symbol = symbols[i];
                String name = names[i];

                ResponseEntity<String> response = restTemplate.exchange(
                    YAHOO_URL, 
                    HttpMethod.GET, 
                    entity, 
                    String.class, 
                    symbol
                );
                
                JsonNode root = mapper.readTree(response.getBody());
                JsonNode meta = root.path("chart").path("result").get(0).path("meta");
                double currentPrice = meta.path("regularMarketPrice").asDouble();
                double previousClose = meta.path("chartPreviousClose").asDouble();

                double changeRaw = currentPrice - previousClose;
                double changePercent = (changeRaw / previousClose) * 100;

                Map<String, Object> stock = new HashMap<>();
                stock.put("symbol", name);
                stock.put("price", String.format("%,.2f", currentPrice)); 
                stock.put("change", String.format("%+.2f%%", changePercent));
                stock.put("up", changePercent >= 0);

                marketData.add(stock);

            } catch (Exception e) {
                logger.error("Yahoo Finance Blocked/Failed for {}: {}", names[i], e.getMessage());
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("symbol", names[i]);
                fallback.put("price", "---");
                fallback.put("change", "0.00%");
                fallback.put("up", true);
                marketData.add(fallback);
            }
        }
        return marketData;
    }

    // 2. SENTIMENT PROXY (Alternative.me) - DEBUG MODE
    @Cacheable("sentiment")
    public Map<String, Object> getSentiment() {
        logger.info("Fetching REAL data from Alternative.me (Not Cached)...");

        String url = "https://api.alternative.me/fng/?limit=1"; 
        Map<String, Object> result = new HashMap<>();

        try {
            // STEP 1: Better Disguise (Full Browser Headers)
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.set("Accept", "application/json, text/plain, */*");
            headers.set("Accept-Language", "en-US,en;q=0.9");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // STEP 2: Fetch Data
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            JsonNode root = mapper.readTree(response.getBody());
            
            // STEP 3: Parse (Safely)
            if (root.has("data") && root.path("data").size() > 0) {
                JsonNode today = root.path("data").get(0);
                result.put("score", today.path("value").asInt());
                result.put("label", today.path("value_classification").asText());
            } else {
                throw new RuntimeException("API returned valid JSON but no 'data' field found.");
            }
            
            return result;

        } catch (Exception e) {
            logger.error("SENTIMENT FETCH FAILED! Error: {}", e.getMessage());
            e.printStackTrace(); 
            
            // Fallback
            result.put("score", 50);
            result.put("label", "Neutral (Error)");
            return result;
        }
    }
}