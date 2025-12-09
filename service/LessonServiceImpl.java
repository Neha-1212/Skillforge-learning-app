package com.example.jwt.service;

import com.example.jwt.dto.LessonRequestDTO;
import com.example.jwt.dto.LessonResponseDTO;
import com.example.jwt.entities.Lesson;
import com.example.jwt.entities.Module;
import com.example.jwt.repository.LessonRepository;
import com.example.jwt.repository.ModuleRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final CloudinaryService cloudinaryService;

    public LessonServiceImpl(
            LessonRepository lessonRepository,
            ModuleRepository moduleRepository,
            CloudinaryService cloudinaryService
    ) {
        this.lessonRepository = lessonRepository;
        this.moduleRepository = moduleRepository;
        this.cloudinaryService = cloudinaryService;
    }

    private Lesson getLessonOrThrow(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + id));
    }

    private Module getModuleOrThrow(Long id) {
        return moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found with ID: " + id));
    }

    // ====================================
    //          CREATE LESSON
    // ====================================
    @Override
    public LessonResponseDTO createLesson(
            LessonRequestDTO dto,
            MultipartFile video,
            MultipartFile pdf
    ) throws Exception {

        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setDescription(dto.getDescription());
        lesson.setDifficulty(dto.getDifficulty());
        
        lesson.setExternalLink(dto.getExternalLink());

        // Assign module
        if (dto.getModuleId() != null) {
            Module module = getModuleOrThrow(dto.getModuleId());
            lesson.setModule(module);
        }

        // Upload video
        if (video != null && !video.isEmpty()) {
            Map videoUpload = cloudinaryService.uploadFile(video, "lessons/videos");
            lesson.setVideoUrl((String) videoUpload.get("secure_url"));
            lesson.setVideoPublicId((String) videoUpload.get("public_id"));
        }

        // Upload PDF
        if (pdf != null && !pdf.isEmpty()) {
            Map pdfUpload = cloudinaryService.uploadFile(pdf, "lessons/pdfs");
            lesson.setPdfUrl((String) pdfUpload.get("secure_url"));
        }

        Lesson saved = lessonRepository.save(lesson);
        return new LessonResponseDTO(saved);
    }

    // ====================================
    //          UPDATE LESSON
    // ====================================
    @Override
    public LessonResponseDTO updateLesson(
            Long id,
            LessonRequestDTO dto,
            MultipartFile video,
            MultipartFile pdf
    ) throws Exception {

        Lesson lesson = getLessonOrThrow(id);

        lesson.setTitle(dto.getTitle());
        lesson.setDescription(dto.getDescription());
        lesson.setDifficulty(dto.getDifficulty());
      
        lesson.setExternalLink(dto.getExternalLink());

        if (dto.getModuleId() != null) {
            Module module = getModuleOrThrow(dto.getModuleId());
            lesson.setModule(module);
        }

        // Replace video if new one provided
        if (video != null && !video.isEmpty()) {

            if (lesson.getVideoPublicId() != null) {
                cloudinaryService.delete(lesson.getVideoPublicId());
            }

            Map upload = cloudinaryService.uploadFile(video, "lessons/videos");
            lesson.setVideoUrl((String) upload.get("secure_url"));
            lesson.setVideoPublicId((String) upload.get("public_id"));
        }

        // Replace PDF
        if (pdf != null && !pdf.isEmpty()) {
            Map upload = cloudinaryService.uploadFile(pdf, "lessons/pdfs");
            lesson.setPdfUrl((String) upload.get("secure_url"));
        }

        Lesson updated = lessonRepository.save(lesson);
        return new LessonResponseDTO(updated);
    }

    // ====================================
    //          DELETE LESSON
    // ====================================
    @Override
    public void deleteLesson(Long id) {

        Lesson lesson = getLessonOrThrow(id);

        try {
            if (lesson.getVideoPublicId() != null) {
                cloudinaryService.delete(lesson.getVideoPublicId());
            }
        } catch (Exception ignore) {}

        lessonRepository.delete(lesson);
    }

    // ====================================
    //          GET BY ID
    // ====================================
    @Override
    public LessonResponseDTO getById(Long id) {
        return new LessonResponseDTO(getLessonOrThrow(id));
    }

    // ====================================
    //          GET ALL
    // ====================================
    @Override
    public List<LessonResponseDTO> getAllLessons() {
        return lessonRepository.findAll()
                .stream()
                .map(LessonResponseDTO::new)
                .toList();
    }

    // ====================================
    //          GET BY MODULE
    // ====================================
    @Override
    public List<LessonResponseDTO> getLessonsByModule(Long moduleId) {
        return lessonRepository.findByModuleId(moduleId)
                .stream()
                .map(LessonResponseDTO::new)
                .toList();
    }
}
