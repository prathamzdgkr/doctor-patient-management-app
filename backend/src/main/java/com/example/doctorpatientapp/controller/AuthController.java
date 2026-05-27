package com.example.doctorpatientapp.controller;

import com.example.doctorpatientapp.dto.AuthResponse;
import com.example.doctorpatientapp.dto.LoginRequest;
import com.example.doctorpatientapp.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        String token = jwtUtil.generateToken(request.getUsername(), "USER");
        return new AuthResponse(token);
    }
}