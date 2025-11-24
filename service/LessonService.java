package com.example.jwt.service;
import java.util.List;
import java.util.Optional;

import com.example.jwt.dto.LessonRequestDTO;
import com.example.jwt.dto.LessonResponseDTO;
import com.example.jwt.entities.Lesson;

public interface LessonService {
    LessonResponseDTO createLesson( LessonRequestDTO dto);
    Lesson updateLesson(Long id, Lesson lesson);
    void deleteLesson(Long id);
    Optional<Lesson> getLessonById(Long id);
    List<Lesson> getAllLessons();
	//LessonResponseDTO createLesson(LessonRequestDTO dto);

}
