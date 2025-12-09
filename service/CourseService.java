package com.example.jwt.service;

import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourseService {

    // Create a new course with optional thumbnail
    CourseResponseDTO createCourse(CourseRequestDTO dto, MultipartFile thumbnail) throws Exception;

    // Update existing course with optional thumbnail
    CourseResponseDTO updateCourse(Long id, CourseRequestDTO dto, MultipartFile thumbnail) throws Exception;

    // Get a single course by ID
    CourseResponseDTO getCourseById(Long id);

    // Get all courses
    List<CourseResponseDTO> getCourseAll();
    // ✅ YE NAYA METHOD ADD KARO
    List<CourseResponseDTO> getMyCourses(String email);

    // Delete a course (also remove thumbnail from Cloudinary if exists)
    void deleteCourse(Long id) throws Exception;
}
