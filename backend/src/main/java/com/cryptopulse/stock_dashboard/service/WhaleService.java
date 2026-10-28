package com.cryptopulse.stock_dashboard.service;

import com.cryptopulse.stock_dashboard.model.WhaleTransaction;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class WhaleService {

    private final Random random = new Random();
    private final DecimalFormat df = new DecimalFormat("#,###");

    public List<WhaleTransaction> getWhaleData() {
        List<WhaleTransaction> transactions = new ArrayList<>();
        
        // Generate 5 random "Whale" movements
        for (int i = 0; i < 5; i++) {
            transactions.add(generateRandomTransaction());
        }
        
        return transactions;
    }

    private WhaleTransaction generateRandomTransaction() {
        String[] coins = {"BTC", "ETH", "SOL", "USDT", "XRP"};
        String[] types = {"Accumulated", "Dumped", "Minted", "Burned"};
        
        String coin = coins[random.nextInt(coins.length)];
        String type = types[random.nextInt(types.length)];
        
        // Logic: Generate realistic massive numbers
        double amountRaw = 0;
        double price = 0;
        
        switch (coin) {
            case "BTC": amountRaw = 50 + (random.nextDouble() * 500); price = 65000; break;
            case "ETH": amountRaw = 500 + (random.nextDouble() * 5000); price = 3500; break;
            case "SOL": amountRaw = 10000 + (random.nextDouble() * 50000); price = 140; break;
            case "USDT": amountRaw = 1000000 + (random.nextDouble() * 50000000); price = 1; break; // Millions
            case "XRP": amountRaw = 500000 + (random.nextDouble() * 2000000); price = 0.60; break;
        }

        String amount = df.format(amountRaw);
        String usdValue = "$" + df.format(amountRaw * price);
        String wallet = "0x" + Integer.toHexString(random.nextInt());

        return new WhaleTransaction(coin, type, amount, usdValue, wallet);
    }
}