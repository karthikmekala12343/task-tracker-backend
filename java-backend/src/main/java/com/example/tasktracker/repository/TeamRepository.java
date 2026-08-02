package com.example.tasktracker.repository;

import com.example.tasktracker.entity.Team;
import com.example.tasktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByMembersContaining(User member);
}
