package com.example.backend.controller;

import com.example.backend.models.Message;
import com.example.backend.models.Room;
import com.example.backend.models.User;
import com.example.backend.repo.RoomRepository;
import com.example.backend.repo.UserRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {


    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ChatController(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @Payload Map<String, Object> request
    ) {
        // Extract message details
        String content = (String) request.get("content");
        String senderId = (String) request.get("sender");
        String eventTitle = (String) request.get("eventTitle");

        // Validate inputs
        if (content == null || senderId == null) {
            throw new IllegalArgumentException("Invalid message request");
        }

        // Find or create room
        Room room = roomRepository.findByRoomId(roomId)
                .orElseGet(() -> {
                    Room newRoom = new Room();
                    newRoom.setRoomId(roomId);
                    newRoom.setEventTitle(eventTitle);
                    newRoom.setGroupChat(true);
                    newRoom.setCreatedAt(new Date());
                    newRoom.setMessages(new ArrayList<>());
                    newRoom.setParticipants(new ArrayList<>());
                    System.out.println("Chat");
                    return roomRepository.save(newRoom);
                });

        // Find sender user (assuming you have a UserRepository)
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create message
        Message message = new Message();
        message.setSender(sender.getId());
        message.setContent(content);
        message.setSenderName(sender.getUsername());
        message.setTimeStamp(LocalDateTime.now());

        // Add message to room
        if (room.getMessages() == null) {
            room.setMessages(new ArrayList<>());
        }
        room.getMessages().add(message);

        // Update participants
        if (room.getParticipants() == null) {
            room.setParticipants(new ArrayList<>());
        }
        if (!room.getParticipants().contains(senderId)) {
            room.getParticipants().add(senderId);
        }

        // Save updated room
        roomRepository.save(room);

        return message;
    }
}