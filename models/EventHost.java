package com.eventmatch.eventmatchproject.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "event_hosts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventHost {

    @Id
    private String id;

    private String name;

    private String email;

    private String organization;

    @Field
    private List<ObjectId> events;

    private LocalDateTime createdAt = LocalDateTime.now();
}
