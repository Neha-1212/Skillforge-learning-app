package com.example.jwt.service;

import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import com.example.jwt.entities.Course;
import com.example.jwt.entities.Instructor;
import com.example.jwt.entities.Module;
import com.example.jwt.repository.CourseRepository;
import com.example.jwt.repository.InstructorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final CloudinaryService cloudinaryService;

    public CourseServiceImpl(CourseRepository courseRepository,
                             InstructorRepository instructorRepository,
                             CloudinaryService cloudinaryService) {
        this.courseRepository = courseRepository;
        this.instructorRepository = instructorRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // ---------------- CREATE COURSE ----------------
    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO dto, MultipartFile thumbnail) throws Exception {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setDifficulty(dto.getDifficulty());
        course.setDuration(dto.getDuration());

        // Instructor assign
        if (dto.getInstructorId() != null) {
            Instructor instructor = instructorRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            course.setInstructor(instructor);
        }

        // Thumbnail upload
        if (thumbnail != null && !thumbnail.isEmpty()) {
            Map uploadResult = cloudinaryService.uploadFile(thumbnail, "courses/thumbnails");
            course.setThumbnailUrl((String) uploadResult.get("secure_url"));
            course.setThumbnailPublicId((String) uploadResult.get("public_id"));
        }

        // ---------------- MODULES SAVE ----------------
        if (dto.getModules() != null && !dto.getModules().isEmpty()) {
            List<Module> modules = dto.getModules().stream().map(m -> {
                Module module = new Module();
                module.setTitle(m.getTitle());
                module.setDescription(m.getDescription());
                module.setCourse(course);  // important
                return module;
            }).collect(Collectors.toList());

            course.setModules(modules); // attach modules to course
        }

        Course saved = courseRepository.save(course);
        return mapToDTO(saved);
    }


    // ---------------- UPDATE COURSE ----------------
    @Override
    public CourseResponseDTO updateCourse(Long id, CourseRequestDTO dto, MultipartFile thumbnail) throws Exception {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setCategory(dto.getCategory());
        course.setDifficulty(dto.getDifficulty());
        course.setDuration(dto.getDuration());

        // Instructor assign
        if (dto.getInstructorId() != null) {
            Instructor instructor = instructorRepository.findById(dto.getInstructorId())
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
            course.setInstructor(instructor);
        }

        // Thumbnail upload (replace old)
        if (thumbnail != null && !thumbnail.isEmpty()) {
            if (course.getThumbnailPublicId() != null) {
                cloudinaryService.delete(course.getThumbnailPublicId());
            }

            Map uploadResult = cloudinaryService.uploadFile(thumbnail, "courses/thumbnails");

            course.setThumbnailUrl((String) uploadResult.get("secure_url"));
            course.setThumbnailPublicId((String) uploadResult.get("public_id"));
        }

        // --------------- UPDATE MODULES ----------------
     // Safe module clearing
        if (course.getModules() != null) {
            course.getModules().clear();
        }


        if (dto.getModules() != null) {
            List<Module> modules = dto.getModules().stream().map(m -> {
                Module module = new Module();
                module.setTitle(m.getTitle());
                module.setDescription(m.getDescription());
                module.setCourse(course);
                return module;
            }).collect(Collectors.toList());

            course.setModules(modules);
        }

        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }


    // ---------------- GET SINGLE ----------------
    @Override
    public CourseResponseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToDTO(course);
    }

    // ---------------- GET ALL ----------------
    @Override
    public List<CourseResponseDTO> getCourseAll() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ---------------- DELETE ----------------
    @Override
    public void deleteCourse(Long id) throws Exception {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.getThumbnailPublicId() != null) {
            cloudinaryService.delete(course.getThumbnailPublicId());
        }

        courseRepository.delete(course);
    }

    // ---------------- ENTITY → DTO ----------------
    private CourseResponseDTO mapToDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO(course);
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setCategory(course.getCategory());
        dto.setDifficulty(course.getDifficulty());
        dto.setDuration(course.getDuration());
        dto.setThumbnailUrl(course.getThumbnailUrl());

        if (course.getInstructor() != null) {
            dto.setInstructorId(course.getInstructor().getId());
            dto.setInstructorName(course.getInstructor().getName());
        }

        if (course.getModules() != null) {
            List<CourseResponseDTO.ModuleDTO> moduleDTOs = course.getModules()
                    .stream()
                    .map(CourseResponseDTO.ModuleDTO::new)
                    .collect(Collectors.toList());

            dto.setModules(moduleDTOs);
        }

        return dto;
    }
    @Override
    public List<CourseResponseDTO> getMyCourses(String email) {

        Instructor instructor = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        return courseRepository.findByInstructor(instructor)
                .stream()
                .map(course -> new CourseResponseDTO(course))
                .collect(Collectors.toList());
    }




}
