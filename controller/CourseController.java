package com.example.jwt.controller;

import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import com.example.jwt.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // ---------------- CREATE COURSE ----------------
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<CourseResponseDTO> createCourse(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String difficulty,
            @RequestParam String duration,
            @RequestParam(required = false) MultipartFile thumbnail
    ) throws Exception {
        CourseRequestDTO courseDTO = new CourseRequestDTO();
        courseDTO.setTitle(title);
        courseDTO.setDescription(description);
        courseDTO.setCategory(category);
        courseDTO.setDifficulty(difficulty);
        courseDTO.setDuration(duration);

        return ResponseEntity.ok(courseService.createCourse(courseDTO, thumbnail));
    }

    // ---------------- UPDATE COURSE ----------------
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<CourseResponseDTO> updateCourse(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String difficulty,
            @RequestParam String duration,
            @RequestParam(required = false) MultipartFile thumbnail
    ) throws Exception {
        CourseRequestDTO courseDTO = new CourseRequestDTO();
        courseDTO.setTitle(title);
        courseDTO.setDescription(description);
        courseDTO.setCategory(category);
        courseDTO.setDifficulty(difficulty);
        courseDTO.setDuration(duration);

        return ResponseEntity.ok(courseService.updateCourse(id, courseDTO, thumbnail));
    }
    // ✅ MY COURSES API
    @GetMapping("/mycourse")
    public List<CourseResponseDTO> getMyCourses(Principal principal) {

        String email = principal.getName();   // JWT se email milega ✅

        return courseService.getMyCourses(email);
    }

    // ---------------- GET ALL COURSES ----------------
    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getCourseAll());
    }

    // ---------------- GET SINGLE COURSE ----------------
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // ---------------- DELETE COURSE ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) throws Exception {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
   

}
