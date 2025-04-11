package com.example.backend.controller;

import com.example.backend.models.EventHost;
import com.example.backend.repo.EventHostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-hosts")
public class EventHostController {

    @Autowired
    private EventHostRepository eventHostRepository;

    @GetMapping
    public List<EventHost> getAllHosts() {
        return eventHostRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventHost> getHostById(@PathVariable String id) {
        return eventHostRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public EventHost createHost(@RequestBody EventHost eventHost) {
        return eventHostRepository.save(eventHost);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventHost> updateHost(@PathVariable String id, @RequestBody EventHost hostDetails) {
        return eventHostRepository.findById(id)
                .map(host -> {
                    host.setName(hostDetails.getName());
                    host.setOrganization(hostDetails.getOrganization());
                    host.setEmail(hostDetails.getEmail());
                    return ResponseEntity.ok(eventHostRepository.save(host));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHost(@PathVariable String id) {
        if (eventHostRepository.existsById(id)) {
            eventHostRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
