package com.example.backend.repo;

import com.example.backend.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    Payment findByPaymentIntentId(String paymentIntentId);
    Payment findByAuctionIdAndWinnerId(String auctionId, String userId);
}