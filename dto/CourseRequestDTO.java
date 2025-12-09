package com.example.jwt.dto;

import java.util.List;

public class CourseRequestDTO {

    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String duration;
    private String thumbnailUrl;
    private Long instructorId;
    private List<ModuleRequestDTO> modules;   // <---- IMPORTANT

    public CourseRequestDTO() {}

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
    public List<ModuleRequestDTO> getModules() { return modules; }
    public void setModules(List<ModuleRequestDTO> modules) { this.modules = modules; }

	
}
