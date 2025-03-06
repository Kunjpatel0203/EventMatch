package com.eventmatch.eventmatchproject.repo;

import com.eventmatch.eventmatchproject.models.EventHost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventHostRepository extends MongoRepository<EventHost, String> {
    EventHost findByEmail(String email); // Find an event host by email
    Optional<EventHost> getEventHostsById(String id);
}
