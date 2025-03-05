package com.eventmatch.eventmatchproject.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private Long amount;  // Amount in smallest currency unit (e.g., cents)
    private String currency;
}
