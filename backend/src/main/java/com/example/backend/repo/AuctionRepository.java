package com.example.backend.repo;

import com.example.backend.models.Auction;
import com.example.backend.models.AuctionStatus;
import com.example.backend.models.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionRepository extends MongoRepository<Auction, String> {
    List<Auction> findByStatus(AuctionStatus status); // Example: Find auctions by status (active, finished, etc.)
    List<Auction> findByEvent(Event event);
}
