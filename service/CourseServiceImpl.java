package com.example.jwt.service;

import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import com.example.jwt.entities.Course;
import com.example.jwt.repository.CourseRepository;
import com.example.jwt.service.CloudinaryService;
import com.example.jwt.service.CourseService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public  class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CloudinaryService cloudinaryService;

    public CourseServiceImpl(CourseRepository courseRepository, CloudinaryService cloudinaryService) {
        this.courseRepository = courseRepository;
        this.cloudinaryService = cloudinaryService;
    }

 //   @Override
   // public CourseRequest  create(CourseRequest DTOcourse ) {
    	
    	
     //   return courseRepository.save(course);
    //}

    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO dto) {

        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setDifficulty(dto.getDifficulty());
        course.setDuration(dto.getDuration());
        
        Course saved = courseRepository.save(course);

        return new CourseResponseDTO(saved);
    }

    
    @Override
    public Course update(Long id, Course course ) {
        Course existing = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        existing.setTitle(course.getTitle());
        existing.setDescription(course.getDescription());
        existing.setCategory(course.getCategory());
        existing.setDifficulty(course.getDifficulty());
        existing.setDuration(course.getDuration());

        // do not overwrite thumbnail unless uploaded separately
        return courseRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        Course c = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        // Optionally delete cloudinary thumbnail
        if (c.getThumbnailPublicId() != null) {
            try { cloudinaryService.delete(c.getThumbnailPublicId()); } catch (Exception e) { /* log */ }
        }
        courseRepository.deleteById(id);
    }

    @Override
    public Course getById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    @Override
    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    @Override
    public Course uploadThumbnail(Long courseId, MultipartFile file) throws Exception {
        Course course = getById(courseId);
        Map result = cloudinaryService.uploadFile(file, "courses/thumbnails");
        String url = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");
        course.setThumbnailUrl(url);
        course.setThumbnailPublicId(publicId);
        return courseRepository.save(course);
    }
}
