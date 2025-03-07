package com.eventmatch.eventmatchproject.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
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
}

