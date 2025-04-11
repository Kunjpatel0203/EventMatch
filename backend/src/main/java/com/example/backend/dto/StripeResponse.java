package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StripeResponse {
    private String sessionUrl;

    public StripeResponse(String sessionUrl) {
        this.sessionUrl = sessionUrl;
    }
}