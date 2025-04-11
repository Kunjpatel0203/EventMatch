package com.example.backend.repo;

import com.example.backend.models.Sponsor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SponsorRepository extends MongoRepository<Sponsor, String> {
    Sponsor findByEmail(String email); // Find a sponsor by email
}