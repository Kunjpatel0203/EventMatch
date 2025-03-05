package com.eventmatch.eventmatchproject.controller;

import com.eventmatch.eventmatchproject.dto.ProductRequest;
import com.eventmatch.eventmatchproject.dto.StripeResponse;
import com.eventmatch.eventmatchproject.service.PaymentService;
import com.eventmatch.eventmatchproject.service.StripeService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody ProductRequest productRequest) throws StripeException {
        StripeResponse stripeResponse = stripeService.createCheckoutSession(productRequest);
        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }
}
