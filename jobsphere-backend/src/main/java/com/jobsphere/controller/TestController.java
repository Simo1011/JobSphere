package com.jobsphere.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public String hello() {
        return "✅ JobSphere Backend is working successfully!";
    }

    @GetMapping("/status")
    public String status() {
        return "Backend is up and running - " + java.time.LocalDateTime.now();
    }
}