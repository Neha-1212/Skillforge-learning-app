package com.example.jwt.repository;



import com.example.jwt.entities.Course;
import com.example.jwt.entities.Instructor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {

	Optional<Instructor> findByInstructor(Instructor instructor);
	
}
