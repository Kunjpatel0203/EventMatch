package com.example.backend.controller;

import com.example.backend.models.Message;
import com.example.backend.models.Room;
import com.example.backend.repo.RoomRepository;
import com.example.backend.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomController(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/ensure")
    public ResponseEntity<?> ensureRoomExists(@RequestBody Map<String, Object> request) {
        String roomId = (String) request.get("roomId");
        String eventTitle = (String) request.get("eventTitle");
        String sender = (String) request.get("sender");

        // First check if room exists by roomId
        Optional<Room> existingRoomById = roomRepository.findByRoomId(roomId);
        if (existingRoomById.isPresent()) {
            if(!existingRoomById.get().getParticipants().contains(sender)) {
                existingRoomById.get().getParticipants().add(sender);
            }
            roomRepository.save(existingRoomById.get());
            return ResponseEntity.ok(existingRoomById.get());
        }

        // Create new room if none exists
        Room newRoom = new Room();
        newRoom.setRoomId(roomId);
        newRoom.setEventTitle(eventTitle);
        newRoom.setGroupChat(true);
        newRoom.setCreatedAt(new Date());
        newRoom.setMessages(new ArrayList<>());
        newRoom.setParticipants(new ArrayList<>());
        System.out.println("Room");

        // Add sender to participants if not already present
        if (sender != null && !newRoom.getParticipants().contains(sender)) {
            newRoom.getParticipants().add(sender);
        }

        // Save room
        return ResponseEntity.ok(roomRepository.save(newRoom));
    }

    // Get Messages with Pagination
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "20", required = false) int size
    ) {
        Optional<Room> roomOptional = roomRepository.findByRoomId(roomId);

        if (!roomOptional.isPresent()) {
            return ResponseEntity.notFound().build(); // Or handle as appropriate
        }

        Room room = roomOptional.get();
        List<Message> messages = room.getMessages();
        messages.sort(Comparator.comparing(Message::getTimeStamp).reversed());

        int start = page * size;
        int end = Math.min(start + size, messages.size());

        List<Message> paginatedMessages = (start < messages.size())
                ? messages.subList(start, end)
                : new ArrayList<>();

        return ResponseEntity.ok(paginatedMessages);
    }

    @GetMapping("/user/{userId}/events-and-auctions")
    public ResponseEntity<List<Room>> getUserEventRooms(@PathVariable String userId) {
        // Find all rooms where the user is a participant
        List<Room> allUserRooms = roomRepository.findByParticipantsContaining(userId);

        // Group by eventId to ensure one room per event
        Map<String, Room> uniqueEventRooms = new HashMap<>();

        for (Room room : allUserRooms) {
            String eventId = room.getRoomId();
            if (eventId != null && !uniqueEventRooms.containsKey(eventId)) {
                uniqueEventRooms.put(eventId, room);
            }
        }

        return ResponseEntity.ok(new ArrayList<>(uniqueEventRooms.values()));
    }
}