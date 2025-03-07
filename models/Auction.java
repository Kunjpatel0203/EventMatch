package com.eventmatch.eventmatchproject.models;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    @JsonBackReference
    private ObjectId event;

    private String itemName;
    private String itemDescription;
    private double startingBid;
    private double bidIncrement;

    private Instant auctionStartTime;

    private Instant auctionEndTime;

    private int duration; // in minutes

    private AuctionStatus status = AuctionStatus.UPCOMING;

    private double currentHighestBid = 0;

    private List<Bid> bids = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}

