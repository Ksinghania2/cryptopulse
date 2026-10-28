package com.cryptopulse.stock_dashboard;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.repository.MarketRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// @Configuration
public class DataSeeder {

    // @Bean
    CommandLineRunner initDatabase(MarketRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Market btc = new Market();
                btc.setId("BTC"); // Explicitly setting String ID
                btc.setEvent("Bitcoin to break $80k this week?");
                btc.setYesVotes(150);
                btc.setNoVotes(42);
                btc.setVolume("$2.4M");

                Market eth = new Market();
                eth.setId("ETH"); // Explicitly setting String ID
                eth.setEvent("Ethereum gas fees to drop?");
                eth.setYesVotes(89);
                eth.setNoVotes(112);
                eth.setVolume("$1.1M");

                repository.save(btc);
                repository.save(eth);
                
                System.out.println("======================================");
                System.out.println("DATABASE SEEDED WITH STARTING MARKETS!");
                System.out.println("======================================");
            }
        };
    }
}