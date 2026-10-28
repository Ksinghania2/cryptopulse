package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.service.StockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to talk to us
public class StockController {

    private static final Logger logger = LoggerFactory.getLogger(StockController.class);
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // Endpoint 1: Macro Stocks (Yahoo)
    @GetMapping("/market-summary")
    public List<Map<String, Object>> getMarketSummary() {
        logger.info("Fetching Live Stock Market Summary (Yahoo Finance)...");
        return stockService.getMarketSummary();
    }

    // Endpoint 2: Sentiment (Alternative.me Proxy)
    @GetMapping("/sentiment")
    public Map<String, Object> getSentiment() {
        logger.info("Fetching Fear & Greed Index...");
        return stockService.getSentiment();
    }
}