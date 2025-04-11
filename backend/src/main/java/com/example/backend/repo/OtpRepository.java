package com.example.backend.repo;

import com.example.backend.models.OtpDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface OtpRepository extends MongoRepository<OtpDocument, String> {
    Optional<OtpDocument> findByEmailAndOtpAndUsedFalse(String email, String otp);
    // Add this to your OtpRepository interface
    List<OtpDocument> findByEmailAndUsedFalse(String email);
}
