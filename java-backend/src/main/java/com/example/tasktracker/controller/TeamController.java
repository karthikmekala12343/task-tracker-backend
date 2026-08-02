package com.example.tasktracker.controller;

import com.example.tasktracker.entity.Team;
import com.example.tasktracker.entity.User;
import com.example.tasktracker.repository.TeamRepository;
import com.example.tasktracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamController(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody Team team, Principal principal) {
        Optional<User> owner = userRepository.findByEmail(principal.getName());
        if (owner.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        team.setOwner(owner.get());
        team.getMembers().add(owner.get());
        return ResponseEntity.status(201).body(teamRepository.save(team));
    }

    @GetMapping
    public ResponseEntity<List<Team>> listTeams(Principal principal) {
        Optional<User> user = userRepository.findByEmail(principal.getName());
        return user.map(value -> ResponseEntity.ok(teamRepository.findByMembersContaining(value)))
                .orElseGet(() -> ResponseEntity.status(401).build());
    }
}
