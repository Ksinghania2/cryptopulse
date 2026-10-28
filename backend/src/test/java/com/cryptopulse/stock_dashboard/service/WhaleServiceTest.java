package com.cryptopulse.stock_dashboard.service;

import com.cryptopulse.stock_dashboard.model.WhaleTransaction;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class WhaleServiceTest {

    @Test
    void getWhaleData_returnsFiveTransactions() {
        WhaleService service = new WhaleService();
        List<WhaleTransaction> data = service.getWhaleData();
        assertEquals(5, data.size());
        for (WhaleTransaction tx : data) {
            assertNotNull(tx.getCoinSymbol());
            assertNotNull(tx.getType());
            assertNotNull(tx.getAmount());
            assertNotNull(tx.getUsdValue());
            assertNotNull(tx.getWalletAddress());
        }
    }
}