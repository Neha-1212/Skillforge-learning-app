package com.example.jwt.repository;



import com.example.jwt.entities.Lesson;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
	   // Find all lessons by module ID
    List<Lesson> findByModuleId(Long moduleId);
}

