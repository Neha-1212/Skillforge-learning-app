package com.example.jwt.controller;

import com.example.jwt.dto.ModuleRequestDTO;
import com.example.jwt.dto.ModuleResponseDTO;
import com.example.jwt.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin("*")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    // ---------------- CREATE MODULE ----------------
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ModuleResponseDTO createModule(@RequestBody ModuleRequestDTO dto) {
        return moduleService.createModule(dto);
    }

    // ---------------- UPDATE MODULE ----------------
    @PutMapping(value = "/{id}", 
                consumes = MediaType.APPLICATION_JSON_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ModuleResponseDTO updateModule(
            @PathVariable Long id,
            @RequestBody ModuleRequestDTO dto
    ) {
        return moduleService.updateModule(id, dto);
    }

    // ---------------- GET ALL MODULES ----------------
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ModuleResponseDTO> getAllModules() {
        return moduleService.getAll();
    }

    // ---------------- GET MODULE BY ID ----------------
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ModuleResponseDTO getModule(@PathVariable Long id) {
        return moduleService.getById(id);
    }

    // ---------------- DELETE MODULE ----------------
    @DeleteMapping("/{id}")
    public void deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
    }

    // ---------------- GET MODULES BY COURSE ----------------
    @GetMapping(value = "/course/{courseId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<ModuleResponseDTO> getModulesByCourse(@PathVariable Long courseId) {
        return moduleService.getAllModules()
                .stream()
                .filter(m -> m.getCourse().getId().equals(courseId))
                .map(ModuleResponseDTO::new)
                .toList();
    }
}
