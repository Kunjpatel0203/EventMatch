package com.example.backend.controller;


import com.example.backend.dto.AuctionDTO;
import com.example.backend.dto.BidDTO;
import com.example.backend.models.*;
import com.example.backend.repo.AuctionRepository;
import com.example.backend.repo.EventRepository;
import com.example.backend.repo.UserRepository;
import com.example.backend.service.EmailService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auctions")
@CrossOrigin("*")
public class AuctionController {

    @Autowired
    private AuctionRepository auctionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    EventRepository eventRepository;
    @Autowired
    private EmailService emailService;

    private static final int extraTimeOnBid = 1;

    @GetMapping
    public List<Auction> getAllAuctions() {
        List<Auction> auctions = auctionRepository.findAll();
        auctions.forEach(this::updateAuctionStatus);
        auctionRepository.saveAll(auctions);
        return auctions;
        //return auctionRepository.findAll();
    }

    @GetMapping("/{eventId}/{auctionId}")
    public ResponseEntity<?> getAuctionForEvent(@PathVariable String eventId, @PathVariable String auctionId) {

        Optional<Auction> auctionOptional = auctionRepository.findById(auctionId);

        Auction auction = auctionOptional.orElseThrow(() -> new RuntimeException("Auction not found for this event"));

        // Validate if the auction belongs to the event
        if (!auction.getEvent().toString().equals(eventId)) {
            throw new RuntimeException("Auction does not belong to this event");
        }

        updateAuctionStatus(auction);
        auctionRepository.save(auction);

        // Convert Auction to AuctionDTO
        AuctionDTO auctionDTO = mapToAuctionDTO(auction);

        LocalDateTime now = LocalDateTime.now();  // Current UTC time

        //LocalDateTime auctionStartTime = auction.getAuctionStartTime().atZone(ZoneId.of("UTC")).toLocalDateTime();
        LocalDateTime auctionEndTime = auction.getAuctionEndTime().atZone(ZoneId.of("UTC")).toLocalDateTime();
        // Check if auction has ended
        if (now.isAfter(auctionEndTime) && "ACTIVE".equals(auction.getStatus())) {
            auction.setStatus(AuctionStatus.valueOf("FINISHED"));
            auctionRepository.save(auction);
            System.out.println("Auction finished.............");
            // Notify host and winner
            notifyAuctionHost(auction);
        }
        return ResponseEntity.ok(auctionDTO);

    }

    private void notifyAuctionHost(Auction auction) {
        try {
            Event event=eventRepository.findById(String.valueOf(auction.getEvent())).orElse(null);
            User host = userRepository.findById(String.valueOf(event.getHost())).orElse(null);
            System.out.println(host.getEmail());
            if (host == null || host.getEmail() == null) {
                System.err.println("Host or host email not found");
                return;
            }

            if (auction.getBids().isEmpty()) {
                // No bids were placed
                String noBidsMessage = "Your auction for " + auction.getItemName() + " has ended with no bids.";
                emailService.sendEmail(host.getEmail(), "Auction Ended - No Bids", noBidsMessage);
                System.out.println("Email sent to host: " + host.getEmail());
                return;
            }

            // Find the highest bid
            Bid winningBid = auction.getBids().stream()
                    .max((b1, b2) -> Double.compare(b1.getAmount(), b2.getAmount()))
                    .orElse(null);

            if (winningBid == null) return;

            // Find the winner
            User winner = userRepository.findById(String.valueOf(winningBid.getBidder())).orElse(null);

            if (winner != null && winner.getEmail() != null) {
                String winnerEmailMessage = "Congratulations! You've won the auction for " + auction.getItemName() +
                        ". Winning bid: $" + winningBid.getAmount();
                emailService.sendEmail(winner.getEmail(), "Auction Won", winnerEmailMessage);
                System.out.println("Email sent to winner: " + winner.getEmail());
            }

            // Notify the host
            String hostEmailMessage = "Your auction for " + auction.getItemName() +
                    " has ended. Winning bid: $" + winningBid.getAmount() +
                    ". Winner email: " + (winner != null ? winner.getEmail() : "Not found.");
            emailService.sendEmail(host.getEmail(), "Auction Ended", hostEmailMessage);
            System.out.println("Email sent to host: " + host.getEmail());

        } catch (Exception e) {
            System.err.println("Error sending auction emails: " + e.getMessage());
        }
    }

    @PostMapping("/{auctionId}/bid")
    public ResponseEntity<?> placeBid(@PathVariable String auctionId, @RequestBody Bid bid) {
//        Optional<Auction> auctionOptional = auctionRepository.findById(auctionId);
//        if (!auctionOptional.isPresent()) {
//            return ResponseEntity.status(404).body("Auction not found");
//        }
//
//        Auction auction = auctionOptional.get();
//        if (isAuctionExpired(auction)) {
//            auction.setStatus(AuctionStatus.valueOf("FINISHED"));
//            auctionRepository.save(auction);
//            return ResponseEntity.status(403).body("Auction has expired. No more bids allowed.");
//        }
//
//        Event event = eventRepository.findById(auction.getEvent().toString()).orElse(null);
//        if (event.getHost()!=null && event.getHost().equals(bid.getBidder())) {
//            return ResponseEntity.status(403).body("Event hosts cannot bid on their own auctions");
//        }
//
//        if (bid.getAmount() <= auction.getCurrentHighestBid() ||
//                bid.getAmount() < auction.getStartingBid() ||
//                bid.getAmount() < auction.getCurrentHighestBid() + auction.getBidIncrement()) {
//            return ResponseEntity.badRequest().body("Invalid bid amount");
//        }
//
//        User bidder = userRepository.findById(bid.getBidder().toString()).orElse(null);
//        if (bidder == null) {
//            return ResponseEntity.badRequest().body("Bidder does not exist");
//        }
//        bidder.getParticipatedAuctions().add(new ObjectId(auctionId));
//        userRepository.save(bidder);
//
//        Bid newBid = new Bid(new ObjectId(bidder.getId()), bid.getAmount(), LocalDateTime.now());
//        //Bid newBid = new Bid(auction,bid.getBidder(), bid.getAmount(), now);
//        auction.getBids().add(newBid);
//        auction.setCurrentHighestBid(bid.getAmount());
//        System.out.println(auction.getId());
//        System.out.println(auction.getEvent());
//        auctionRepository.save(auction);
//
//        return ResponseEntity.ok(auction);

        Optional<Auction> auctionOptional = auctionRepository.findById(auctionId);
        if (!auctionOptional.isPresent()) {
            return ResponseEntity.status(404).body("Auction not found");
        }

        Auction auction = auctionOptional.get();
        updateAuctionStatus(auction);

        if (auction.getStatus() == AuctionStatus.FINISHED) {
            return ResponseEntity.status(403).body("Auction has ended. No more bids allowed.");
        }

        Event event = eventRepository.findById(auction.getEvent().toString()).orElse(null);
        if (event != null && event.getHost().equals(bid.getBidder())) {
            return ResponseEntity.status(403).body("Event hosts cannot bid on their own auctions");
        }

        if (bid.getAmount() <= auction.getCurrentHighestBid() ||
                bid.getAmount() < auction.getStartingBid() ||
                bid.getAmount() < auction.getCurrentHighestBid() + auction.getBidIncrement()) {
            return ResponseEntity.badRequest().body("Invalid bid amount");
        }

        User bidder = userRepository.findById(String.valueOf(bid.getBidder())).orElse(null);
        if (bidder == null) {
            return ResponseEntity.badRequest().body("Bidder does not exist");
        }

        bidder.getParticipatedAuctions().add(new ObjectId(auctionId));
        userRepository.save(bidder);

        // Add new bid
        Bid newBid = new Bid(new ObjectId(bidder.getId()), bid.getAmount(), LocalDateTime.now());
        auction.getBids().add(newBid);
        auction.setCurrentHighestBid(bid.getAmount());
        auction.setUpdatedAt(LocalDateTime.now());

        // Reset the auction timer by extending end time
        auction.setAuctionEndTime(LocalDateTime.now().plusMinutes(extraTimeOnBid)
                .atZone(ZoneId.of("UTC"))
                .toInstant());
        auctionRepository.save(auction);

        return ResponseEntity.ok(mapToAuctionDTO(auction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAuctionById(@PathVariable String id) {
        Optional<Auction> auctionOptional = auctionRepository.findById(id);

        if (auctionOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Auction not found");
        }

        Auction auction = auctionOptional.get();

        // Update status before returning response
        updateAuctionStatus(auction);
        auctionRepository.save(auction);

        return ResponseEntity.ok(mapToAuctionDTO(auction));
    }

    @PostMapping("create")
    public Auction createAuction(@RequestBody Auction auction) {
        return auctionRepository.save(auction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auction> updateAuction(@PathVariable String id, @RequestBody Auction auctionDetails) {
        return auctionRepository.findById(id)
                .map(auction -> {
                    auction.setItemName(auctionDetails.getItemName());
                    auction.setItemDescription(auctionDetails.getItemDescription());
                    auction.setStartingBid(auctionDetails.getStartingBid());
                    auction.setBidIncrement(auctionDetails.getBidIncrement());
                    auction.setDuration(auctionDetails.getDuration());
                    auction.setStatus(auctionDetails.getStatus());
                    auction.setCurrentHighestBid(auctionDetails.getCurrentHighestBid());
                    auction.setUpdatedAt(auctionDetails.getUpdatedAt());
                    return ResponseEntity.ok(auctionRepository.save(auction));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuction(@PathVariable String id) {
        if (auctionRepository.existsById(id)) {
            auctionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    public void updateAuctionStatus(Auction auction) {

        LocalDateTime nowUtc = LocalDateTime.now();  // Current UTC time
        LocalDateTime auctionStartTime = auction.getAuctionStartTime().atZone(ZoneId.of("UTC")).toLocalDateTime();
        LocalDateTime auctionEndTime = auction.getAuctionEndTime().atZone(ZoneId.of("UTC")).toLocalDateTime();
        if (nowUtc.isBefore(auctionStartTime)) {
            auction.setStatus(AuctionStatus.UPCOMING);  // Auction is upcoming
        } else if (nowUtc.isAfter(auctionStartTime) && nowUtc.isBefore(auctionEndTime)) {
            auction.setStatus(AuctionStatus.ACTIVE);  // Auction is active
        } else {
            auction.setStatus(AuctionStatus.FINISHED);  // Auction is finished
        }
        auctionRepository.save(auction);

    }

    private AuctionDTO mapToAuctionDTO(Auction auction) {
        AuctionDTO dto = new AuctionDTO();
        dto.setId(auction.getId());
        dto.setItemName(auction.getItemName());
        dto.setItemDescription(auction.getItemDescription());
        dto.setStartingBid(auction.getStartingBid());
        dto.setBidIncrement(auction.getBidIncrement());
        dto.setAuctionStartTime(auction.getAuctionStartTime().atZone(ZoneId.of("UTC")).toLocalDateTime());
        dto.setAuctionEndTime(auction.getAuctionEndTime().atZone(ZoneId.of("UTC")).toLocalDateTime());
        dto.setImages(auction.getImages());
        dto.setBenefits(auction.getBenefits());
        dto.setDuration(auction.getDuration());
        dto.setStatus(auction.getStatus());
        dto.setCurrentHighestBid(auction.getCurrentHighestBid());
        dto.setCreatedAt(auction.getCreatedAt());
        dto.setUpdatedAt(auction.getUpdatedAt());

        List<BidDTO> bidDTOs = auction.getBids().stream()
                .map(bid -> new BidDTO(userRepository.findById(bid.getBidder().toString()).get().getUsername(), bid.getBidder().toString(), bid.getAmount(), bid.getTimestamp()))
                .collect(Collectors.toList());

        dto.setBids(bidDTOs);
        // Set event properly
        dto.setEvent(eventRepository.findById(auction.getEvent().toString()).orElse(null));
        //System.out.println(dto.getEvent().getHost());
//        Optional<Event> event = eventRepository.findById(String.valueOf(auction.getEvent()));
//        if (event.isPresent()) {
//            EventDTO eventDTO = new EventDTO();
//            eventDTO.setId(event.get().getId());
//            eventDTO.setName(event.getName());
//            if (event.get().getHost() != null) {
//                eventDTO.setHost(event.get().getHost().toHexString()); // Convert ObjectId to String
//            }
//            dto.setEvent(eventDTO);
//        }
        return dto;
    }
}