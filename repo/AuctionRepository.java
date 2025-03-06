package com.eventmatch.eventmatchproject.repo;

import com.eventmatch.eventmatchproject.models.Auction;
import com.eventmatch.eventmatchproject.models.AuctionStatus;
import com.eventmatch.eventmatchproject.models.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuctionRepository extends MongoRepository<Auction, String> {
    List<Auction> findByStatus(AuctionStatus status); // Example: Find auctions by status (active, finished, etc.)
    List<Auction> findByEvent(Event event);
}
