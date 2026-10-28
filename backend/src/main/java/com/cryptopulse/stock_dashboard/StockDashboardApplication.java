package com.cryptopulse.stock_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching; // 1. Import this

@SpringBootApplication
@EnableCaching // 2. Add this annotation to turn on the Caching System
public class StockDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(StockDashboardApplication.class, args);
	}

}
