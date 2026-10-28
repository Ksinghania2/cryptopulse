package com.cryptopulse.stock_dashboard.model;

public class WhaleTransaction {
    private String coinSymbol;
    private String type;
    private String amount;
    private String usdValue;
    private String walletAddress;

    // THIS IS THE MISSING CONSTRUCTOR
    public WhaleTransaction(String coinSymbol, String type, String amount, String usdValue, String walletAddress) {
        this.coinSymbol = coinSymbol;
        this.type = type;
        this.amount = amount;
        this.usdValue = usdValue;
        this.walletAddress = walletAddress;
    }

    // Getters (Needed for the JSON response)
    public String getCoinSymbol() { return coinSymbol; }
    public String getType() { return type; }
    public String getAmount() { return amount; }
    public String getUsdValue() { return usdValue; }
    public String getWalletAddress() { return walletAddress; }
}