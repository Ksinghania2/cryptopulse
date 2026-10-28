package com.cryptopulse.stock_dashboard.repository;

import com.cryptopulse.stock_dashboard.model.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketRepository extends JpaRepository<Market, String> {
    // That's it! Spring automatically writes the SQL for us.
}
