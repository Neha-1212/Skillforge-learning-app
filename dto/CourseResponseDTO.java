package com.example.jwt.dto;

import com.example.jwt.entities.Course;
import com.example.jwt.entities.Module;
import java.util.List;
import java.util.stream.Collectors;

public class CourseResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String duration;

    private String thumbnailUrl;

    private InstructorResponseDTO instructor;
    private List<ModuleResponseDTO> modules;

    public CourseResponseDTO() {}

    // ✅ Constructor that maps Course → CourseResponseDTO
    public CourseResponseDTO(Course course) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.description = course.getDescription();
        this.category = course.getCategory();
        this.difficulty = course.getDifficulty();
        this.duration = course.getDuration();
       
        this.thumbnailUrl = course.getThumbnailUrl();

       

        // Module List mapping
        if (course.getModules() != null) {
            this.modules = course.getModules()
                    .stream()
                    .map(m -> new ModuleResponseDTO(
                            m.getId(),
                            m.getTitle(),
                            m.getDescription(),
                            m.getCourse().getId()
                    ))
                    .collect(Collectors.toList());
        }
    }

    // ------------ GETTERS & SETTERS --------------------

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public String getDifficulty() {
        return difficulty;
    }
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDuration() {
        return duration;
    }
    public void setDuration(String duration) {
        this.duration = duration;
    }

    

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public InstructorResponseDTO getInstructor() {
        return instructor;
    }
    public void setInstructor(InstructorResponseDTO instructor) {
        this.instructor = instructor;
    }

    public List<ModuleResponseDTO> getModules() {
        return modules;
    }
    public void setModules(List<ModuleResponseDTO> modules) {
        this.modules = modules;
    }
}
;


