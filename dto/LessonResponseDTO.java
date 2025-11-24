package com.example.jwt.dto;

import java.util.List;

public class LessonResponseDTO {

    private Long id;
    private String title;
    private String videoUrl;
    private String pdfUrl;
    private String externalLink;
    private String difficulty;
    private List<String> tags;
    private Long moduleId;

    public LessonResponseDTO() {}

    // <- The constructor you need
    public LessonResponseDTO(Long id,
                             String title,
                             String videoUrl,
                             String pdfUrl,
                             String externalLink,
                             String difficulty,
                             List<String> tags,
                             Long moduleId) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.pdfUrl = pdfUrl;
        this.externalLink = externalLink;
        this.difficulty = difficulty;
        this.tags = tags;
        this.moduleId = moduleId;
    }

    // Getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public String getExternalLink() { return externalLink; }
    public void setExternalLink(String externalLink) { this.externalLink = externalLink; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }
}
