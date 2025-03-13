package com.eventmatch.eventmatchproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuctionPaymentRequest {
    private Long amount;
    private Long quantity;
    private String name;
    private String currency;
}