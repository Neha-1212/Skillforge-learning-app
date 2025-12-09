package com.example.jwt.entities;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String duration;

    private String thumbnailUrl;
    private String thumbnailPublicId;

    // ---------------- Instructor ----------------
    @ManyToOne
    @JoinColumn(name = "instructor_id") // foreign key column
    private Instructor instructor;

    // ---------------- Modules ----------------
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Module> modules = new ArrayList<>();

    public Course() {}

    // ---------------- Getters & Setters ----------------
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

    public String getThumbnailPublicId() { return thumbnailPublicId; }
    public void setThumbnailPublicId(String thumbnailPublicId) { this.thumbnailPublicId = thumbnailPublicId; }

    public List<Module> getModules() { return modules; }
    public void setModules(List<Module> modules) { this.modules = modules; }

    public Instructor getInstructor() { return instructor; }
    public void setInstructor(Instructor instructor2) { this.instructor = instructor2; }
}
