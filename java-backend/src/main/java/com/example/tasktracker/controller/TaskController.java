package com.example.tasktracker.controller;

import com.example.tasktracker.entity.Task;
import com.example.tasktracker.entity.User;
import com.example.tasktracker.repository.TaskRepository;
import com.example.tasktracker.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, Principal principal) {
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        task.setCreatedBy(user.get());
        return ResponseEntity.status(201).body(taskRepository.save(task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> listTasks(Principal principal) {
        Optional<User> user = userRepository.findByEmail(principal.getName());
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(taskRepository.findByCreatedByOrAssignee(user.get(), user.get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updates) {
        return taskRepository.findById(id)
                .map(task -> {
                    if (updates.getTitle() != null) task.setTitle(updates.getTitle());
                    if (updates.getDescription() != null) task.setDescription(updates.getDescription());
                    if (updates.getStatus() != null) task.setStatus(updates.getStatus());
                    if (updates.getDueDate() != null) task.setDueDate(updates.getDueDate());
                    return ResponseEntity.ok(taskRepository.save(task));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        taskRepository.delete(task.get());
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
}
