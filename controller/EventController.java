package com.eventmatch.eventmatchproject.controller;

import com.eventmatch.eventmatchproject.dto.AuctionDTO;
import com.eventmatch.eventmatchproject.dto.AuctionRequest;
import com.eventmatch.eventmatchproject.dto.EventDTO;
import com.eventmatch.eventmatchproject.dto.EventRequest;
import com.eventmatch.eventmatchproject.models.*;
import com.eventmatch.eventmatchproject.repo.AuctionRepository;
import com.eventmatch.eventmatchproject.repo.EventRepository;
import com.eventmatch.eventmatchproject.repo.EventHostRepository;
import com.eventmatch.eventmatchproject.repo.UserRepository;
import com.eventmatch.eventmatchproject.service.EmailService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin("*")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    EmailService emailService;

    private static final int extraTimeOnBid = 1;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {

        List<Event> events = eventRepository.findAll();
        List<Auction> allAuctions = auctionRepository.findAll();

        allAuctions.forEach(this::updateAuctionStatus);
        auctionRepository.saveAll(allAuctions);
        Map<String, List<Auction>> auctionsByEventId = allAuctions.stream()
                .filter(auction -> auction.getEvent() != null)
                .collect(Collectors.groupingBy(auction -> String.valueOf(auction.getEvent())));

        allAuctions.forEach(this::updateAuctionStatus);
        auctionRepository.saveAll(allAuctions);

        List<EventDTO> eventDTOs = events.stream().map(event -> {
            EventDTO dto = new EventDTO();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setEventType(event.getEventType());
            dto.setLocation(event.getLocation());
            dto.setDate(event.getDate());
            dto.setImage(event.getImage());
            dto.setCreatedAt(event.getCreatedAt());
            dto.setUpdatedAt(event.getUpdatedAt());

            // Fetch and set host details
            User host = userRepository.findById(event.getHost().toString()).orElse(null);
            dto.setHost(host);

            // Fetch and set auctions
            List<Auction> auctions = auctionsByEventId.getOrDefault(event.getId(), new ArrayList<>())
                    .stream()
                    .peek(this::updateAuctionStatus) // Ensure latest status is set
                    .collect(Collectors.toList());

            dto.setAuctions(auctions);
            //List<Auction> auctions = auctionsByEventId.getOrDefault(event.getId(), new ArrayList<>());
            dto.setAuctions(auctions);

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(eventDTOs);

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable String id) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();

            // Convert Event to EventDTO
            EventDTO dto = new EventDTO();
            dto.setId(event.getId());
            dto.setTitle(event.getTitle());
            dto.setDescription(event.getDescription());
            dto.setEventType(event.getEventType());
            dto.setLocation(event.getLocation());
            dto.setDate(event.getDate());
            dto.setImage(event.getImage());
            dto.setCreatedAt(event.getCreatedAt());
            dto.setUpdatedAt(event.getUpdatedAt());

            dto.setBenefitsToSponsors(event.getBenefitsToSponsors()); // Added benefits to DTO
//  Include Cloudinary image URLs in response
            dto.setPastEventsImages(event.getPastEventsImages());

            // Fetch and set host details
            User host = userRepository.findById(event.getHost().toString()).orElse(null);
            dto.setHost(host);

            // Fetch and set auctions
            List<Auction> allAuctions = auctionRepository.findAll();
            allAuctions.forEach(auction -> updateAuctionStatus(auction));
            auctionRepository.saveAll(allAuctions);
            Map<String, List<Auction>> auctionsByEventId = allAuctions.stream()
                    .filter(auction -> auction.getEvent() != null)
                    .collect(Collectors.groupingBy(auction -> String.valueOf(auction.getEvent())));

            List<Auction> auctions = auctionsByEventId.getOrDefault(event.getId(), new ArrayList<>())
                    .stream()
                    .peek(this::updateAuctionStatus) // Ensure latest status is set
                    .collect(Collectors.toList());
            dto.setAuctions(auctions);

            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(404).body("Event not found");
        }
    }

    @PostMapping("/createEvent")
    public ResponseEntity<?> createEvent(@RequestBody EventRequest eventRequest) {

        try {
            // Create and map Event object
            Event event = new Event();
            event.setTitle(eventRequest.getTitle());
            event.setDescription(eventRequest.getDescription());
            event.setEventType(EventType.valueOf(eventRequest.getEventType().toUpperCase()));
            event.setLocation(eventRequest.getLocation());
            event.setDate(eventRequest.getDate());

            event.setBenefitsToSponsors(eventRequest.getBenefitsToSponsors());

            event.setPastEventsImages(eventRequest.getPastEventsImages());

            // Find the host
            User host = userRepository.findById(eventRequest.getHost().toString())
                    .orElseThrow(() -> new RuntimeException("Host not found"));
            ObjectId hostObjectId = new ObjectId(host.getId());
            event.setHost(hostObjectId);

            // Save the event
            Event savedEvent = eventRepository.save(event);

            // Handle Auctions
            if (eventRequest.getAuctions() != null && !eventRequest.getAuctions().isEmpty()) {
                List<ObjectId> auctions = new ArrayList<>();
                for (AuctionRequest auctionRequest : eventRequest.getAuctions()) {
                    Auction auction = new Auction();
                    auction.setEvent(new ObjectId(savedEvent.getId()));
                    auction.setBids(new ArrayList<>());
                    auction.setItemDescription(auctionRequest.getItemDescription());


                    if (auctionRequest.getAuctionDate() != null && auctionRequest.getAuctionTime() != null) {
                        LocalDate auctionDate = LocalDate.parse(auctionRequest.getAuctionDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
                        LocalTime auctionTime = LocalTime.parse(auctionRequest.getAuctionTime(), DateTimeFormatter.ofPattern("HH:mm"));

                        // Combine into LocalDateTime
                        LocalDateTime auctionStart = LocalDateTime.of(auctionDate, auctionTime);

                        Instant auctionStartInstant = auctionStart.atZone(ZoneId.of("UTC")).toInstant();
                        auction.setAuctionStartTime(auctionStartInstant);

                        auction.setAuctionEndTime(auctionStartInstant.plus(Duration.ofMinutes(auctionRequest.getDuration())));

                        //System.out.println("Auction Start Time (UTC): " + auctionStartInstant);
                        //System.out.println("Auction End Time (UTC): " + auction.getAuctionEndTime());
                    }

                    //ZonedDateTime userLocalTime = auction.getAuctionStartTime().atZone(ZoneId.of("UTC"));
                    //System.out.println("Auction Start Time in UTC: " + userLocalTime);



                    // Set bid details
                    auction.setItemName(auctionRequest.getItemName());
                    auction.setStartingBid(auctionRequest.getStartingBid());
                    auction.setBidIncrement(auctionRequest.getBidIncrement());
                    auction.setDuration(auctionRequest.getDuration());

                    // Set status
                    if (auction.getAuctionStartTime().isAfter(Instant.now())) {
                        auction.setStatus(AuctionStatus.UPCOMING);
                    } else {
                        auction.setStatus(AuctionStatus.FINISHED);
                    }

                    auction.setCreatedAt(LocalDateTime.now());
                    auctions.add(auctionRepository.save(auction).getEvent());
                }
                savedEvent.setAuctions(auctions);
                eventRepository.save(savedEvent);

                sendAuctionNotificationToAllUsers(eventRequest.getTitle(), eventRequest.getAuctions(),host.getId());
            }

            return ResponseEntity.status(201).body(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
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

        // Save the updated auction status to MongoDB
        auctionRepository.save(auction);
    }

    private void sendAuctionNotificationToAllUsers(String eventTitle, List<AuctionRequest> auctions, String hostId) {
        List<User> users = userRepository.findAll()
                .stream()
                .filter(user -> !user.getId().equals(hostId)) // Exclude event host
                .toList();

        if (users.isEmpty()) return; // No users to notify

        String subject = "New Auction Available for Event: " + eventTitle;

        for (User user : users) {
            try {
                StringBuilder emailBody = new StringBuilder();
                emailBody.append("Hello ").append(user.getUsername()).append(",\n\n");
                emailBody.append("A new auction has been added to the event: ").append(eventTitle).append("\n\n");

                for (AuctionRequest auction : auctions) {
                    emailBody.append("🔹 Auction Item: ").append(auction.getItemName()).append("\n");
                    emailBody.append("   - Description: ").append(auction.getItemDescription()).append("\n");
                    emailBody.append("   - Starting Bid: ₹").append(auction.getStartingBid()).append("\n");
                    emailBody.append("   - Auction Date: ").append(auction.getAuctionDate()).append(" at ").append(auction.getAuctionTime()).append("\n");
                    emailBody.append("\n");
                }

                emailBody.append("Visit our website to place your bids!\n\n");
                emailBody.append("Best Regards,\nEventMatch Team");

                emailService.sendEmail(user.getEmail(), subject, emailBody.toString());
            } catch (Exception e) {
                System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            }
        }
    }
}
