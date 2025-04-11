package com.example.backend.dto;

import com.example.backend.models.Auction;
import com.example.backend.models.EventType;
import com.example.backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {

    private String id;

    private String title;
    private String description;

    private EventType eventType;

    private String location;
    private LocalDateTime date;
    private String image;

    private User host;

    private List<Auction> auctions =  new ArrayList<>();

    private List<String> benefitsToSponsors = new ArrayList<>(); // Added this field
    private List<String> pastEventsImages; // New field for Cloudinary image URLs

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public EventType getEventType() {
        return eventType;
    }

    public void setEventType(EventType eventType) {
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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public List<Auction> getAuctions() {
        return auctions;
    }

    public void setAuctions(List<Auction> auctions) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
