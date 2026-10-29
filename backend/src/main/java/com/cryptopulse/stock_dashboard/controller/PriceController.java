package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.service.PriceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prices")
public class PriceController {
    private final PriceService priceService;
    public PriceController(PriceService priceService) { this.priceService = priceService; }

    @GetMapping
    public List<Map<String, Object>> getPrices() {
        return priceService.getLivePrices();
    }
}