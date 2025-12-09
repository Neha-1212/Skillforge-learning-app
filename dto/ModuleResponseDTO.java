package com.example.jwt.dto;

import com.example.jwt.entities.Module;
import java.util.List;
import java.util.stream.Collectors;

public class ModuleResponseDTO {

    private Long id;
    private String title;
    private String description;
    private Long courseId;
 
    private List<LessonResponseDTO> lessons; // lessons inside module

    public ModuleResponseDTO() {}

    public ModuleResponseDTO(Module module) {
        this.id = module.getId();
        this.title = module.getTitle();
        this.description = module.getDescription();
        this.courseId = module.getCourse() != null ? module.getCourse().getId() : null;

        if (module.getLessons() != null) {
            this.lessons = module.getLessons().stream()
                                 .map(LessonResponseDTO::new)
                                 .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public List<LessonResponseDTO> getLessons() { return lessons; }
    public void setLessons(List<LessonResponseDTO> lessons) { this.lessons = lessons; }
}
