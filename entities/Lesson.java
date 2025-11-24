package com.example.jwt.entities;




import jakarta.persistence.*;

import java.util.List;


@Entity
public class Lesson {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


private String title;
private String videoUrl;
private String pdfUrl;
private String externalLink;
private String difficulty;


@ElementCollection
private List<String> tags;


@ManyToOne
private Module module;


public Lesson() {}


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
public Module getModule() { return module; }
public void setModule(Module module) { this.module = module; }





}