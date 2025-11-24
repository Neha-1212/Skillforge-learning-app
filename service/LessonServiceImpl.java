package com.example.jwt.service;

import com.example.jwt.dto.LessonRequestDTO;
import com.example.jwt.dto.LessonResponseDTO;
import com.example.jwt.entities.Lesson;
import com.example.jwt.entities.Module;
import com.example.jwt.repository.LessonRepository;
import com.example.jwt.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ModuleRepository moduleRepository; // needed to fetch Module

    @Override
    public LessonResponseDTO createLesson(LessonRequestDTO dto) {

        Module module = moduleRepository.findById(dto.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found"));

        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setVideoUrl(dto.getVideoUrl());
        lesson.setPdfUrl(dto.getPdfUrl());
        lesson.setExternalLink(dto.getExternalLink());
        lesson.setDifficulty(dto.getDifficulty());
        lesson.setTags(dto.getTags());
        lesson.setModule(module);

        Lesson saved = lessonRepository.save(lesson);

        return new LessonResponseDTO(
            saved.getId(),
            saved.getTitle(),
            saved.getVideoUrl(),
            saved.getPdfUrl(),
            saved.getExternalLink(),
            saved.getDifficulty(),
            saved.getTags(),
            saved.getModule().getId()
        );
    }



    
    
    @Override
    public Lesson updateLesson(Long id, Lesson updatedLesson) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        lesson.setTitle(updatedLesson.getTitle());
       

        // If module update is needed
        if (updatedLesson.getModule() != null) {
            lesson.setModule(updatedLesson.getModule());
        }

        return lessonRepository.save(lesson);
    }

    @Override
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    @Override
    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    @Override
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }
}
