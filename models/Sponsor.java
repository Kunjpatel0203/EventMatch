package com.eventmatch.eventmatchproject.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Document(collection = "sponsors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sponsor {

    @Id
    private String id;

    private String name;

    private String email;

    private String phone;

    private List<String> bids;

}
