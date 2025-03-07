package com.eventmatch.eventmatchproject.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Document(collection = "otps")
public class OtpDocument {
        @Id
        private String id;

        private String email;
        private String otp;
        private LocalDateTime expiryTime;
        private boolean used;

        public OtpDocument() {
            this.expiryTime = LocalDateTime.now().plusMinutes(10);
            this.used = false;
        }

        public boolean isValid() {
            return !used && LocalDateTime.now().isBefore(expiryTime);
        }
}
