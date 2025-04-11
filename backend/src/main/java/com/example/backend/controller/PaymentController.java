package com.example.backend.controller;

import com.example.backend.dto.ProductRequest;
import com.example.backend.dto.StripeResponse;
import com.example.backend.models.Payment;
import com.example.backend.repo.PaymentRepository;
import com.example.backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> initiateSponsorship(
            @RequestBody ProductRequest productRequest,
            @RequestParam String auctionId,
            @RequestParam String winnerId
    ) throws StripeException {
        StripeResponse stripeResponse = stripeService.createCheckoutSession(productRequest, auctionId, winnerId);
        return ResponseEntity.ok(stripeResponse);
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<String> confirmPayment(@RequestParam String sessionId) throws StripeException {
        com.stripe.Stripe.apiKey = stripeSecretKey;
        // Retrieve session from Stripe
        Session session = Session.retrieve(sessionId);
        if ("paid".equals(session.getPaymentStatus())) {
            // Find pending payment in MongoDB and update status
            Payment payment = paymentRepository.findByPaymentIntentId(sessionId);
            if (payment != null) {
                payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
                paymentRepository.save(payment);
                return ResponseEntity.ok("Payment confirmed successfully.");
            } else {
                return ResponseEntity.badRequest().body("Payment record not found.");
            }
        }
        return ResponseEntity.badRequest().body("Payment not completed.");
    }

    @GetMapping("/status/{auctionId}/{userId}")
    public ResponseEntity<Map<String, String>> getPaymentStatus(
            @PathVariable String auctionId,
            @PathVariable String userId
    ) {
        Payment payment = paymentRepository.findByAuctionIdAndWinnerId(auctionId, userId);

        Map<String, String> response = new HashMap<>();
        if (payment != null) {
            response.put("status", payment.getStatus().toString());
        } else {
            response.put("status", "NOT_FOUND");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/details/{auctionId}/{userId}")
    public ResponseEntity<Map<String, Object>> getPaymentDetails(
            @PathVariable String auctionId,
            @PathVariable String userId
    ) {
        Payment payment = paymentRepository.findByAuctionIdAndWinnerId(auctionId, userId);

        Map<String, Object> response = new HashMap<>();
        if (payment != null) {
            response.put("status", payment.getStatus().toString());
            response.put("amount", payment.getAmount());
            response.put("transactionId", payment.getPaymentIntentId());
            response.put("purchasedItem", payment.getAuctionId());
        } else {
            response.put("status", "NOT_FOUND");
        }

        return ResponseEntity.ok(response);
    }
}