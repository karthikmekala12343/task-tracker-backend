package com.example.tasktracker.repository;

import com.example.tasktracker.entity.Attachment;
import com.example.tasktracker.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByTask(Task task);
}
