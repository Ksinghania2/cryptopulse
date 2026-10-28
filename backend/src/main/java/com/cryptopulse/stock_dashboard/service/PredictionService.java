package com.cryptopulse.stock_dashboard.service;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.repository.MarketRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PredictionService {

    private final MarketRepository marketRepository;

    public PredictionService(MarketRepository marketRepository) {
        this.marketRepository = marketRepository;
    }

    // This runs automatically when the server starts
    @PostConstruct
    public void initData() {
        // Only load default data if the database is empty!
        if (marketRepository.count() == 0) {
            marketRepository.save(new Market("1", "Bitcoin to hit $100k in 2026?", 650, 350, "$12M"));
            marketRepository.save(new Market("2", "ETH ETF Approval?", 880, 120, "$45M"));
            marketRepository.save(new Market("3", "Solana to flip BNB?", 420, 580, "$3M"));
            System.out.println("✅ Database Initialized with Default Markets");
        }
    }

    public List<Market> getMarkets() {
        return marketRepository.findAll();
    }

    public Market vote(String id, boolean voteYes) {
        Optional<Market> optionalMarket = marketRepository.findById(id);
        
        if (optionalMarket.isPresent()) {
            Market market = optionalMarket.get();
            if (voteYes) {
                market.setYesVotes(market.getYesVotes() + 1);
            } else {
                market.setNoVotes(market.getNoVotes() + 1);
            }
            // SAVE TO DISK
            return marketRepository.save(market);
        }
        return null;
    }
}