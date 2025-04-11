package com.example.backend.service;

import com.example.backend.dto.ProductRequest;
import com.example.backend.dto.StripeResponse;
import com.example.backend.models.Payment;
import com.example.backend.repo.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Autowired
    private PaymentRepository paymentRepository;

    public StripeResponse createCheckoutSession(ProductRequest productRequest, String auctionId, String winnerId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // Create Stripe Checkout Session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/payment-cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(productRequest.getCurrency())
                                                .setUnitAmount(productRequest.getAmount() * 100)
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

        // Store payment record in MongoDB with status "pending"
        Payment payment = new Payment();
        payment.setAuctionId(auctionId);
        payment.setWinnerId(winnerId);
        payment.setAmount(productRequest.getAmount());
        payment.setCurrency(productRequest.getCurrency());
        payment.setPaymentIntentId(session.getId());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        paymentRepository.save(payment);

        return new StripeResponse(session.getUrl());
    }
}
