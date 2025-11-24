package com.example.jwt.controller;



import com.example.jwt.dto.ModuleRequestDTO;
import com.example.jwt.dto.ModuleResponseDTO;
import com.example.jwt.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin("*")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @PostMapping
    public ModuleResponseDTO createModule(@RequestBody ModuleRequestDTO dto) {
        return moduleService.createModule(dto);
    }
}
