package com.cryptopulse.stock_dashboard.service;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.repository.MarketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarketService {

    @Autowired
    private MarketRepository marketRepository;

    public List<Market> getAllMarkets() {
        return marketRepository.findAll();
    }

    public Market registerVote(String id, String voteType) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Market asset not found: " + id));

        if ("YES".equalsIgnoreCase(voteType) || "BULLISH".equalsIgnoreCase(voteType)) {
            market.setYesVotes(market.getYesVotes() + 1);
        } else if ("NO".equalsIgnoreCase(voteType) || "BEARISH".equalsIgnoreCase(voteType)) {
            market.setNoVotes(market.getNoVotes() + 1);
        } else {
            throw new IllegalArgumentException("Invalid vote type. Use YES or NO.");
        }

        return marketRepository.save(market);
    }
}