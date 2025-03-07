package com.eventmatch.eventmatchproject.service;

import com.eventmatch.eventmatchproject.dto.ProductRequest;
import com.eventmatch.eventmatchproject.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class StripeService {

    @Value("${stripe.api.key}") // Fetch from application.properties
    private String stripeSecretKey;

    //@Value("${frontend.success.url}") // Success URL (redirect after payment)
    private String successUrl;

    //@Value("${frontend.cancel.url}") // Cancel URL (if user cancels payment)
    private String cancelUrl;

    public StripeResponse createCheckoutSession(ProductRequest productRequest) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Create Checkout Session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT) // One-time payment
                .setSuccessUrl("https://www.google.com/search?q=google&rlz=1C1SQJL_enUS761US761&oq=google&gs_lcrp=EgZjaHJvbWUqBwgAEAAYjwIyBwgAEAAYjwIyEwgBEC4YgwEYxwEYsQMY0QMYgAQyDAgCECMYJxiABBiKBTIGCAMQRRg8MgYIBBBFGEEyBggFEEUYPDIGCAYQBRhAMgYIBxBFGDzSAQgzNTkxajBqN6gCALACAA&sourceid=chrome&ie=UTF-8") // Redirect after successful payment
                .setCancelUrl("https://cloud.google.com/") // Redirect if payment is cancelled
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(productRequest.getCurrency())
                                                .setUnitAmount(productRequest.getAmount() * 100) // Convert to cents
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Event Sponsorship Payment")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        return new StripeResponse(session.getUrl()); // Return the session URL
    }
}
