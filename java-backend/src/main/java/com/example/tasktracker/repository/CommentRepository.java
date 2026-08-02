package com.example.tasktracker.repository;

import com.example.tasktracker.entity.Comment;
import com.example.tasktracker.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTask(Task task);
}
