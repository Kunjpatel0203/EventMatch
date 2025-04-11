package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BidDTO {
    private String id;

    private String bidder;

    private double amount;
    private LocalDateTime timestamp = LocalDateTime.now();

    public BidDTO(String id, String bidder, double amount, LocalDateTime timestamp) {
        this.id = id;
        this.bidder = bidder;
        this.amount = amount;
        this.timestamp = timestamp;
    }

    public BidDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBidder() {
        return bidder;
    }

    public void setBidder(String bidder) {
        this.bidder = bidder;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
