package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

    @GetMapping("/correlation")
    public Map<String, Object> correlation() { return analyticsService.getCorrelation(); }

    @GetMapping("/forecast")
    public Map<String, Object> forecast(@RequestParam(defaultValue = "5") int steps) {
        return analyticsService.forecastBtc(steps);
    }
}