package com.example.backend.repo;

import com.example.backend.models.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room, String> {
    //get room using room id
    Optional<Room> findByRoomId(String roomId);
    List<Room> findByParticipantsContaining(String userId);
    boolean existsByRoomId(String roomId);
    Optional<Room> findFirstByRoomId(String roomId);
}