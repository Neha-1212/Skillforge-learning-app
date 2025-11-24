package com.example.jwt.controller;


import com.example.jwt.dto.CourseRequestDTO;
import com.example.jwt.dto.CourseResponseDTO;
import com.example.jwt.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin("*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping
    public CourseResponseDTO createCourse(@RequestBody CourseRequestDTO dto) {
    	System.out.println("Courses is started to creation");
    	return (CourseResponseDTO) courseService.createCourse(dto);
    }
}
