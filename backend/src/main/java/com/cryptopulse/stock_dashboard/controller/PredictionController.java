package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.service.PredictionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// @RestController
// @RequestMapping("/api/predict")
// @CrossOrigin(origins = "http://localhost:4200")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public List<Market> getMarkets() {
        return predictionService.getMarkets();
    }

    @PostMapping("/{id}/vote")
    public Market vote(@PathVariable String id, @RequestParam boolean yes) {
        return predictionService.vote(id, yes);
    }
}