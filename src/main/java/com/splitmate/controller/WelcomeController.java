package com.splitmate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> welcome() {
        return ResponseEntity.ok(Map.of(
                "message", "SplitMate API is running",
                "docs", "See docs/API_EXAMPLES.md",
                "auth", Map.of(
                        "register", "POST /auth/register",
                        "login", "POST /auth/login"
                ),
                "baseUrl", "http://localhost:8080"
        ));
    }
}
