package com.eventmatch.eventmatchproject.repo;

import com.eventmatch.eventmatchproject.models.Sponsor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SponsorRepository extends MongoRepository<Sponsor, String> {
    Sponsor findByEmail(String email); // Find a sponsor by email
}