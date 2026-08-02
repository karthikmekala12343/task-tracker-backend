package com.example.tasktracker.repository;

import com.example.tasktracker.entity.Task;
import com.example.tasktracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatedByOrAssignee(User createdBy, User assignee);
}
