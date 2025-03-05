package com.eventmatch.eventmatchproject.dto;

import com.eventmatch.eventmatchproject.models.Auction;
import com.eventmatch.eventmatchproject.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.eclipse.angus.mail.imap.protocol.UIDSet;

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
}
