package com.example.jwt.service;

import com.example.jwt.dto.LessonRequestDTO;
import com.example.jwt.dto.LessonResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface LessonService {

    // CREATE LESSON
    LessonResponseDTO createLesson(
            LessonRequestDTO dto,
            MultipartFile video,
            MultipartFile pdf
    ) throws Exception;

    // UPDATE LESSON
    LessonResponseDTO updateLesson(
            Long id,
            LessonRequestDTO dto,
            MultipartFile video,
            MultipartFile pdf
    ) throws Exception;

    // DELETE LESSON
    void deleteLesson(Long id);

    // GET BY ID
    LessonResponseDTO getById(Long id);

    // GET ALL LESSONS
    List<LessonResponseDTO> getAllLessons();

    // GET LESSONS BY MODULE
    List<LessonResponseDTO> getLessonsByModule(Long moduleId);
}
