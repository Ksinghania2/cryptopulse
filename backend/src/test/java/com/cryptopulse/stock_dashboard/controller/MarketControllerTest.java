package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.model.Market;
import com.cryptopulse.stock_dashboard.service.MarketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MarketController.class)
class MarketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MarketService marketService;

    @Test
    void getMarkets_returnsOk() throws Exception {
        when(marketService.getAllMarkets()).thenReturn(List.of());
        mockMvc.perform(get("/api/markets"))
                .andExpect(status().isOk());
    }
}