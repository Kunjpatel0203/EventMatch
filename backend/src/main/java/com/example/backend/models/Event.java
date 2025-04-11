package com.example.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    private String id;

    private String title;
    private String description;

    private EventType eventType;

    private String location;
    //private Date date;
    private LocalDateTime date;
    private String image;

    @Field
    //@JsonBackReference
    private ObjectId host;

    @Field
    @JsonManagedReference
    private List<ObjectId> auctions =  new ArrayList<>();

    private List<String> benefitsToSponsors = new ArrayList<>(); // Added this field
    private List<String> pastEventsImages = new ArrayList<>(); // ✅ Store Cloudinary image URLs

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

    public ObjectId getHost() {
        return host;
    }

    public void setHost(ObjectId host) {
        this.host = host;
    }

    public List<ObjectId> getAuctions() {
        return auctions;
    }

    public void setAuctions(List<ObjectId> auctions) {
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

