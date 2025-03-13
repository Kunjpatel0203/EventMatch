package com.eventmatch.eventmatchproject.dto;

import com.eventmatch.eventmatchproject.models.Auction;
import com.eventmatch.eventmatchproject.models.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private String id;

    private String username;

    private boolean verified;

    private String email;

    private String password;


    private String phoneNumber;

    private String instagram;  // New Field
    private String twitter;    // New Field
    private String linkedin;   // New Field
    private String companyName; // New Field

    private List<Event> events;

    private List<Auction> participatedAuctions=new ArrayList<>();
}
