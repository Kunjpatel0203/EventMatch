package com.example.backend.controller;

import com.example.backend.models.Sponsor;
import com.example.backend.repo.SponsorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sponsors")
public class SponsorController {

    @Autowired
    private SponsorRepository sponsorRepository;

    @GetMapping
    public List<Sponsor> getAllSponsors() {
        return sponsorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sponsor> getSponsorById(@PathVariable String id) {
        return sponsorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Sponsor createSponsor(@RequestBody Sponsor sponsor) {
        return sponsorRepository.save(sponsor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sponsor> updateSponsor(@PathVariable String id, @RequestBody Sponsor sponsorDetails) {
        return sponsorRepository.findById(id)
                .map(sponsor -> {
                    sponsor.setName(sponsorDetails.getName());
                    sponsor.setEmail(sponsorDetails.getEmail());
                    sponsor.setPhone(sponsorDetails.getPhone());
                    return ResponseEntity.ok(sponsorRepository.save(sponsor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSponsor(@PathVariable String id) {
        if (sponsorRepository.existsById(id)) {
            sponsorRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
