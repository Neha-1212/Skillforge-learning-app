package com.example.jwt.service;

import com.example.jwt.dto.LoginRequest;
import com.example.jwt.dto.RegisterRequest;
import com.example.jwt.dto.JwtResponse;
import com.example.jwt.entities.Role;
import com.example.jwt.entities.User;
import com.example.jwt.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
	private RegisterRequest registerRequest;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
               .roles(user.getRole().name())
              //.authorities("ROLE_" + savedUser.getRole().name())  // <-- yahan add karo
                .build();
    }

   /* public JwtResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        System.out.println("registration is start");
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // ✅ Always assign a  role (either from request or default)
       if (request.getRole() != null) {
            user.setRole(request.getRole());
        } else {
            user.setRole(Role.STUDENT); // default role
        }

        System.out.println("object is created");
        userRepository.save(user); 
    
    }*/
    public JwtResponse register(RegisterRequest request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        System.out.println("Registration started");

        // Create user object
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set role (default STUDENT)
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        } else {
            user.setRole(Role.STUDENT);
        }

        // Save user
        User savedUser = userRepository.save(user);

        System.out.println("User saved successfully");

        // Generate JWT token
        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(savedUser.getEmail())
                        .password(savedUser.getPassword())
                      // .authorities(savedUser.getRole().name())
                     // .authorities(user.getRole().name())
                     .authorities("ROLE_" + savedUser.getRole().name())  // <-- yahan add karo
                        .build()
        );

        // Return JwtResponse
        return new JwtResponse(
                token,
                savedUser.getRole().name(),
                savedUser.getEmail()
        );
    }

 

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities(user.getRole().name())
                     //.authorities("ROLE_" + savedUser.getRole().name()) 
                     .authorities("ROLE_" + user.getRole().name()) 
                     // <-- yahan add karo
                        .build()
        );


        return new JwtResponse(token,  user.getRole().name(), user.getEmail());
    }
}
