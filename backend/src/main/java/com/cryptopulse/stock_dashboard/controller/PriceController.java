package com.cryptopulse.stock_dashboard.controller;

import com.cryptopulse.stock_dashboard.service.PriceService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/prices")
public class PriceController {

    private final PriceService priceService;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    public PriceController(PriceService priceService) {
        this.priceService = priceService;
    }

    @GetMapping
    public List<Map<String, Object>> getPrices() {
        return priceService.getLivePrices();
    }

    // Server-Sent Events stream for real-time price updates (replaces polling)
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamPrices() {
        SseEmitter emitter = new SseEmitter(0L);
        Runnable task = () -> {
            try {
                while (true) {
                    List<Map<String, Object>> prices = priceService.getLivePrices();
                    emitter.send(SseEmitter.event().name("prices").data(prices));
                    Thread.sleep(3000);
                }
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        };
        scheduler.execute(task);
        emitter.onCompletion(() -> {});
        emitter.onTimeout(emitter::complete);
        return emitter;
    }
}