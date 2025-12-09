package com.example.jwt.controller;

import com.example.jwt.dto.LessonRequestDTO;
import com.example.jwt.dto.LessonResponseDTO;
import com.example.jwt.service.LessonService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // ✅ CREATE LESSON
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<LessonResponseDTO> createLesson(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long moduleId,

            @RequestParam(required = false) String externalLink,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String tags,

            @RequestParam(required = false) MultipartFile video,
            @RequestParam(required = false) MultipartFile pdf
    ) throws Exception {

        LessonRequestDTO dto = buildDto(title, description, moduleId,
                externalLink, difficulty, tags);

        LessonResponseDTO response = lessonService.createLesson(dto, video, pdf);
        return ResponseEntity.ok(response);
    }

    // ✅ UPDATE LESSON
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<LessonResponseDTO> updateLesson(
            @PathVariable Long id,

            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Long moduleId,

            @RequestParam(required = false) String externalLink,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String tags,

            @RequestParam(required = false) MultipartFile video,
            @RequestParam(required = false) MultipartFile pdf
    ) throws Exception {

        LessonRequestDTO dto = buildDto(title, description, moduleId,
                externalLink, difficulty, tags);

        LessonResponseDTO response = lessonService.updateLesson(id, dto, video, pdf);
        return ResponseEntity.ok(response);
    }

    // ✅ DELETE LESSON
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<LessonResponseDTO> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(lessonService.getById(id));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<LessonResponseDTO>> getAllLessons() {
        return ResponseEntity.ok(lessonService.getAllLessons());
    }

    // ✅ GET BY MODULE
    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<LessonResponseDTO>> getByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(lessonService.getLessonsByModule(moduleId));
    }

    // ✅ Helper method
    private LessonRequestDTO buildDto(String title, String description, Long moduleId,
                                      String externalLink, String difficulty, String tagsJson) throws Exception {
        LessonRequestDTO dto = new LessonRequestDTO();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setModuleId(moduleId);
        dto.setExternalLink(externalLink);
        dto.setDifficulty(difficulty);

       
        return dto;
    }
}
