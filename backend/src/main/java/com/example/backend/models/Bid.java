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
@NoArgsConstructor
@AllArgsConstructor
public class Bid {

    @Id
    private String id;

    @Field
    private ObjectId bidder;

    private double amount;
    private LocalDateTime timestamp = LocalDateTime.now();

    public Bid(ObjectId bidder, double amount, LocalDateTime now) {
        this.id = new ObjectId().toString();
        this.bidder = bidder;
        this.amount = amount;
        this.timestamp = now;
    }
}
