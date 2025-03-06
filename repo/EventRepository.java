package com.eventmatch.eventmatchproject.repo;

import com.eventmatch.eventmatchproject.models.Event;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByHost(ObjectId hostId); // Find events by host
}