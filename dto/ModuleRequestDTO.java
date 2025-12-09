package com.example.jwt.dto;

public class ModuleRequestDTO {

    private String title;
    private String description;
    private Long courseId; // Module belongs to which course

    public ModuleRequestDTO() {}

    public ModuleRequestDTO(String title, String description, Long courseId) {
        this.title = title;
        this.description = description;
        this.courseId = courseId;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
}
