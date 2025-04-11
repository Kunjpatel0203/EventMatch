package com.example.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "bids")
@Getter
@Setter
@AllArgsConstructor
public class Bid {

    @Id
    private String id;

    @Field
    private ObjectId bidder;

    private double amount;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Bid() {
    }

    public Bid(ObjectId bidder, double amount, LocalDateTime now) {
        this.id = new ObjectId().toString();
        this.bidder = bidder;
        this.amount = amount;
        this.timestamp = now;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ObjectId getBidder() {
        return bidder;
    }

    public void setBidder(ObjectId bidder) {
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