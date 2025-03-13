package com.eventmatch.eventmatchproject.dto;

import com.eventmatch.eventmatchproject.models.AuctionStatus;
import com.eventmatch.eventmatchproject.models.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDTO {
    private String id;

    private Event event;

    private String itemName;
    private String itemDescription;
    private double startingBid;
    private double bidIncrement;


    private LocalDateTime auctionStartTime;

    private LocalDateTime auctionEndTime;
    private int duration; // in minutes

    private AuctionStatus status ;

    private List<BidDTO> bids = new ArrayList<>();

    private double currentHighestBid;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
