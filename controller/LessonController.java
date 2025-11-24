package com.example.jwt.controller;



	import com.example.jwt.dto.LessonRequestDTO;
	import com.example.jwt.dto.LessonResponseDTO;
	import com.example.jwt.service.LessonService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.web.bind.annotation.*;

	@RestController
	@RequestMapping("/api/lessons")
	@CrossOrigin("*")
	public class LessonController {

	    @Autowired
	    private LessonService lessonService;

	    @PostMapping
	    public LessonResponseDTO createLesson(@RequestBody LessonRequestDTO dto) {
	        return lessonService.createLesson(dto);
	    }
	}
	
