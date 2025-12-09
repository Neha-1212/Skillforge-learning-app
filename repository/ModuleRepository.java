package com.example.jwt.repository;

import com.example.jwt.entities.Lesson;
import com.example.jwt.entities.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    // Optional: Get all modules of a course
    List<Module> findByCourseId(Long courseId);
    // Optional: Search lessons by title
    List<Lesson> findByTitleContainingIgnoreCase(String keyword);


}
