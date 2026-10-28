package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.service.MarketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping
    public List<Market> getMarkets() {
        return marketService.getAllMarkets();
    }

    // Changed Long id to String id
    @PostMapping("/{id}/vote")
    public Market castVote(@PathVariable String id, @RequestParam String type) {
        return marketService.registerVote(id, type);
    }
}