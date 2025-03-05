package com.eventmatch.eventmatchproject.dto;

import com.eventmatch.eventmatchproject.models.Auction;
import com.eventmatch.eventmatchproject.models.EventType;
import com.eventmatch.eventmatchproject.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
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

}
