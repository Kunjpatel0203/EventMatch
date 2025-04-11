package com.example.backend.service;

import com.example.backend.models.OtpDocument;
import com.example.backend.models.User;
import com.example.backend.repo.OtpRepository;
import com.example.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    public String generateAndSendOtp(String email) {
        // Check if email already exists and is verified
        if (userRepository.existsByEmail(email)) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && userOpt.get().isVerified()) {
                throw new RuntimeException("Email already registered and verified");
            }
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Save OTP to database
        OtpDocument otpDocument = new OtpDocument();
        otpDocument.setEmail(email);
        otpDocument.setOtp(otp);
        otpRepository.save(otpDocument);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);

        return "OTP sent successfully to " + email;
    }

    public ResponseEntity<?> verifyOtpAndRegister(String email, String otp, User userDetails) {
        // Find valid OTP
        System.out.println(email);
        System.out.println(otp);
        Optional<OtpDocument> otpDocOpt = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp);

        if (otpDocOpt.isPresent()) {
            OtpDocument otpDoc = otpDocOpt.get();

            if (isValid(otpDoc.getExpiryTime(),otpDoc.isUsed())) {
                // Mark OTP as used
                otpDoc.setUsed(true);
                otpRepository.save(otpDoc);

                // Check if user exists but is not verified
                Optional<User> existingUserOpt = userRepository.findByEmail(email);
                User user;

                System.out.println(userDetails.getPassword());
                if (existingUserOpt.isPresent()) {
                    user = existingUserOpt.get();
                    user.setUsername(userDetails.getUsername());
                    user.setPassword(userDetails.getPassword());
                } else {
                    // Create new user
                    user = new User();
                    user.setEmail(email);
                    user.setUsername(userDetails.getUsername());
                    user.setPassword(userDetails.getPassword());
                }
                user.setVerified(true);
                userRepository.save(user);
                return ResponseEntity.ok(user);
            } else {
                //throw new RuntimeException("OTP expired");
                return ResponseEntity.badRequest().body("Otp expired");
            }
        } else {
            //throw new RuntimeException("Invalid OTP");
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
    }

    public boolean isValid(LocalDateTime expiryTime,Boolean used) {
        return !used && expiryTime.isAfter(LocalDateTime.now());
    }

}
