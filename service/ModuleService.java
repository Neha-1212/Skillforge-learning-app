package com.example.jwt.service;

import java.util.List;
import java.util.Optional;

import com.example.jwt.dto.ModuleRequestDTO;
import com.example.jwt.dto.ModuleResponseDTO;
import com.example.jwt.entities.Module;

public interface ModuleService {

    ModuleResponseDTO createModule(ModuleRequestDTO dto);

    ModuleResponseDTO updateModule(Long id, ModuleRequestDTO dto);  // ✔ FIXED

    void deleteModule(Long id);

    Optional<Module> getModuleById(Long id);

    List<Module> getAllModules();
}
