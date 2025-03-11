package com.example.backend.models;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "auctions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Auction {

    @Id
    private String id;

    @Field
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId event;

    private String itemName;
    private String itemDescription;
    private double startingBid;
    private double bidIncrement;

    private Instant auctionStartTime;

    private Instant auctionEndTime;

    private int duration; // in minutes
    private List<String> benefits = new ArrayList<>(); // Added this field
    private List<String> images = new ArrayList<>(); // ✅ Store Cloudinary image URLs

    private AuctionStatus status = AuctionStatus.UPCOMING;

    private double currentHighestBid = 0;

    private List<Bid> bids = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
