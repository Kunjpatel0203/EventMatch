package com.eventmatch.eventmatchproject.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionRequest {
    private String itemName;
    private String itemDescription;
    private double startingBid;
    private double bidIncrement;
    private String auctionDate;
    private String auctionTime;
    private int duration;
    private String status;
}
