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
import java.util.stream.Collectors;

@Service
public class ModuleServiceImpl implements ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    @Autowired
    private CourseRepository courseRepository;

    // CREATE MODULE
    @Override
    public ModuleResponseDTO createModule(ModuleRequestDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Module module = new Module();
        module.setTitle(dto.getTitle());
        module.setDescription(dto.getDescription());
        module.setCourse(course);

        Module saved = moduleRepository.save(module);
        return new ModuleResponseDTO(saved);
    }

    // UPDATE MODULE
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
        return new ModuleResponseDTO(updated);
    }

    // GET SINGLE MODULE
    @Override
    public ModuleResponseDTO getById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        return new ModuleResponseDTO(module);
    }

    // GET ALL MODULES (DTO LIST)
    @Override
    public List<ModuleResponseDTO> getAll() {
        return moduleRepository.findAll()
                .stream()
                .map(ModuleResponseDTO::new)
                .collect(Collectors.toList());
    }

    // DELETE MODULE
    @Override
    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) throw new RuntimeException("Module not found");
        moduleRepository.deleteById(id);
    }

    // ENTITY METHODS (internal use)
    @Override
    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }
}
