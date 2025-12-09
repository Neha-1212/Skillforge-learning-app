package com.example.jwt.dto;

import com.example.jwt.entities.Lesson;
import java.util.List;

public class LessonResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String externalLink;
    private String videoUrl;
    private String pdfUrl;
 
    private Long moduleId;

    public LessonResponseDTO() {}

    public LessonResponseDTO(Lesson lesson) {
        this.id = lesson.getId();
        this.title = lesson.getTitle();
        this.description = lesson.getDescription();
        this.difficulty = lesson.getDifficulty();
        this.externalLink = lesson.getExternalLink();
        this.videoUrl = lesson.getVideoUrl();
        this.pdfUrl = lesson.getPdfUrl();
      
        this.moduleId = lesson.getModule() != null ? lesson.getModule().getId() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getExternalLink() { return externalLink; }
    public void setExternalLink(String externalLink) { this.externalLink = externalLink; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

   

    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
}
