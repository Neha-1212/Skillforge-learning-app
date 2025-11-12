package com.example.jwt.controller;



import com.example.jwt.dto.LoginRequest;
import com.example.jwt.dto.RegisterRequest;
import com.example.jwt.entities.User;
import com.example.jwt.dto.JwtResponse;
import com.example.jwt.service.UserService;
import com.example.jwt.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins ="*")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
		this.userRepository = userRepository;
		
    }

    @PostMapping("/register")
    public JwtResponse register(@RequestBody RegisterRequest request) {
    	System.out.print("I am here");
        return userService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@RequestBody LoginRequest request) {
    	System.out.println("enter in loggin");
        return userService.login(request);
    }
  
   
}
