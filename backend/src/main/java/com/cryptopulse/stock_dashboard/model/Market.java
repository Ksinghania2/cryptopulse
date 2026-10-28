package com.cryptopulse.stock_dashboard.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "markets")
public class Market {

    @Id
    private String id; // Changed to String to match your repository (e.g., "BTC")
    private String event;
    private int yesVotes;
    private int noVotes;
    private String volume;

    // 1. Empty constructor required by Hibernate/Spring JPA
    public Market() {
    }

    // 2. 5-Argument constructor required by your PredictionService
    public Market(String id, String event, int yesVotes, int noVotes, String volume) {
        this.id = id;
        this.event = event;
        this.yesVotes = yesVotes;
        this.noVotes = noVotes;
        this.volume = volume;
    }

    // --- Getters and Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEvent() { return event; }
    public void setEvent(String event) { this.event = event; }

    public int getYesVotes() { return yesVotes; }
    public void setYesVotes(int yesVotes) { this.yesVotes = yesVotes; }

    public int getNoVotes() { return noVotes; }
    public void setNoVotes(int noVotes) { this.noVotes = noVotes; }

    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
}