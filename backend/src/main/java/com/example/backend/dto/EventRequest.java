package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private String eventType;
    private String location;
    private LocalDateTime date;
    private ObjectId host;
    private List<AuctionRequest> auctions;

    private List<String> benefitsToSponsors; // <-- Added this field

    private List<String> pastEventsImages; // ✅ Store Cloudinary image URLs

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public ObjectId getHost() {
        return host;
    }

    public void setHost(ObjectId host) {
        this.host = host;
    }

    public List<AuctionRequest> getAuctions() {
        return auctions;
    }

    public void setAuctions(List<AuctionRequest> auctions) {
        this.auctions = auctions;
    }

    public List<String> getBenefitsToSponsors() {
        return benefitsToSponsors;
    }

    public void setBenefitsToSponsors(List<String> benefitsToSponsors) {
        this.benefitsToSponsors = benefitsToSponsors;
    }

    public List<String> getPastEventsImages() {
        return pastEventsImages;
    }

    public void setPastEventsImages(List<String> pastEventsImages) {
        this.pastEventsImages = pastEventsImages;
    }
}
