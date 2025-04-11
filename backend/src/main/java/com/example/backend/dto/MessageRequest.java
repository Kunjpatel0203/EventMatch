package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

    private String roomId;
    private String content;
    private String sender; // or User sender
    private String eventId;
    private String eventTitle;
    private boolean isGroupMessage;

}
