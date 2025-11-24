package com.example.jwt.service;

import com.example.jwt.dto.ModuleRequestDTO;
import com.example.jwt.dto.ModuleResponseDTO;
import com.example.jwt.entities.Course;
import com.example.jwt.entities.Module;
import com.example.jwt.repository.CourseRepository;
import com.example.jwt.repository.ModuleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public ModuleResponseDTO createModule(ModuleRequestDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Module module = new Module();
        module.setTitle(dto.getTitle());
        module.setDescription(dto.getDescription());
        module.setCourse(course);

        Module saved = moduleRepository.save(module);

        return new ModuleResponseDTO(saved.getId(), saved.getTitle(), saved.getDescription(), saved.getCourse().getId());
    }

    @Override
    public ModuleResponseDTO updateModule(Long id, ModuleRequestDTO dto) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        module.setTitle(dto.getTitle());
        module.setDescription(dto.getDescription());
        module.setCourse(course);

        Module updated = moduleRepository.save(module);

        return new ModuleResponseDTO(updated.getId(), updated.getTitle(), updated.getDescription(), updated.getCourse().getId());
    }

    @Override
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }

    @Override
    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }
}
