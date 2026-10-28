package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.model.WhaleTransaction;
import com.cryptopulse.stock_dashboard.service.WhaleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/whales")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular to access this
public class WhaleController {

    // 1. SECURITY: Define the SLF4J Logger
    private static final Logger logger = LoggerFactory.getLogger(WhaleController.class);

    private final WhaleService whaleService;

    public WhaleController(WhaleService whaleService) {
        this.whaleService = whaleService;
    }

    @GetMapping
    public List<WhaleTransaction> getWhaleTransactions() {
        // 2. LOGGING: Record the access internally, don't just print it
        logger.info("Request received: Fetching live whale transactions.");
        
        try {
            List<WhaleTransaction> data = whaleService.getWhaleData();
            logger.debug("Successfully retrieved {} transactions.", data.size());
            return data;
        } catch (Exception e) {
            // 3. SECURITY: Log the full error here, but NEVER send the stack trace to the user
            logger.error("Critical error fetching whale data: ", e);
            throw e; // We will catch this in the next step (Global Handler)
        }
    }

    @GetMapping("/optimization")
    public String getOptimization() {
        logger.info("Request received: Portfolio Optimization Audit.");
        // This simulates a complex AI calculation
        return "{\"btc\":\"60%\", \"eth\":\"30%\", \"sol\":\"10%\", \"riskLevel\":\"MODERATE\"}";
    }
}