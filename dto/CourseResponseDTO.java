package com.example.jwt.dto;

import com.example.jwt.entities.Course;
import com.example.jwt.entities.Instructor;

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
    private Long instructorId;
    private String instructorName;
    private List<ModuleDTO> modules;

    public CourseResponseDTO(Instructor course) {}

    public CourseResponseDTO(Course course) {
        this.id = course.getId();
        this.title = course.getTitle();
        this.description = course.getDescription();
        this.category = course.getCategory();
        this.difficulty = course.getDifficulty();
        this.duration = course.getDuration();
        this.thumbnailUrl = course.getThumbnailUrl();

        if (course.getInstructor() != null) {
            this.instructorId = course.getInstructor().getId();
            this.instructorName = course.getInstructor().getName();
        }

        if (course.getModules() != null) {
            this.modules = course.getModules().stream()
                    .map(ModuleDTO::new)
                    .collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public Long getInstructorId() { return instructorId; }
    public void setInstructorId(Long instructorId) { this.instructorId = instructorId; }

    public String getInstructorName() { return instructorName; }
    public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

    public List<ModuleDTO> getModules() { return modules; }
    public void setModules(List<ModuleDTO> modules) { this.modules = modules; }

    public static class ModuleDTO {
        private Long id;
        private String title;
        private String description;

        public ModuleDTO() {}

        public ModuleDTO(com.example.jwt.entities.Module module) {
            this.id = module.getId();
            this.title = module.getTitle();
            this.description = module.getDescription();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
