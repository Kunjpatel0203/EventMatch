package com.example.backend.repo;

import com.example.backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email); // Find a user by email
    User findByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findById(String userId);
}
