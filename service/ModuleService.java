package com.example.jwt.service;

import com.example.jwt.dto.ModuleRequestDTO;
import com.example.jwt.dto.ModuleResponseDTO;
import com.example.jwt.entities.Module;

import java.util.List;
import java.util.Optional;

public interface ModuleService {

    // Module create/update without file
    ModuleResponseDTO createModule(ModuleRequestDTO dto);

    ModuleResponseDTO updateModule(Long id, ModuleRequestDTO dto);

    // Get module
    ModuleResponseDTO getById(Long id);

    List<ModuleResponseDTO> getAll();

    // Delete module
    void deleteModule(Long id);

    // Entity methods
    Optional<Module> getModuleById(Long id);

    List<Module> getAllModules();
}
