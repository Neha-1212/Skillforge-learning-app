package com.example.jwt.service;

import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import com.example.jwt.entities.Course;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseRequestDTO dto);

    Course update(Long id, Course dto);
    void delete(Long id);
    Course getById(Long id);
    List<Course> getAll();

    // Add this ↓↓↓  (this was missing)
    Course uploadThumbnail(Long courseId, MultipartFile file) throws Exception;


}
