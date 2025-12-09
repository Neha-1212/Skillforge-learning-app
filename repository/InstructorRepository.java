
package com.example.jwt.repository;

import com.example.jwt.entities.Instructor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructorRepository extends JpaRepository<Instructor, Long> {

	Optional<Instructor> findByEmail(String email);
}

