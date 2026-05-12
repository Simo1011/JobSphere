package com.jobsphere.controller;

import com.jobsphere.dto.ApplicationDTO;
import com.jobsphere.dto.JobWithApplicationsDTO;
import com.jobsphere.entity.ApplicationStatus;
import com.jobsphere.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * Apply to a Job with optional Resume Upload (PDF)
     */
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationDTO> applyToJob(
            @PathVariable Long jobId,
            @RequestParam(value = "resume", required = false) MultipartFile resumeFile,
            Authentication authentication) throws IOException {

        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long applicantId = (Long) authentication.getDetails();

        // This line must pass the resumeFile
        ApplicationDTO application = applicationService.applyToJob(jobId, applicantId, resumeFile);

        return ResponseEntity.ok(application);
    }

    /**
     * Seeker - Get My Applications
     */
    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationDTO>> getMyApplications(Authentication authentication) {

        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long applicantId = (Long) authentication.getDetails();
        List<ApplicationDTO> myApplications = applicationService.getMyApplications(applicantId);
        return ResponseEntity.ok(myApplications);
    }

    /**
     * Recruiter - Get Applications Received on their jobs
     */
    @GetMapping("/received")
    public ResponseEntity<List<JobWithApplicationsDTO>> getApplicationsReceived(Authentication authentication) {

        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long recruiterId = (Long) authentication.getDetails();
        List<JobWithApplicationsDTO> received = applicationService.getApplicationsReceived(recruiterId);
        return ResponseEntity.ok(received);
    }


    /**
     * Recruiter - Update Application Status
     */
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationDTO> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {

        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long recruiterId = (Long) authentication.getDetails();

        ApplicationDTO updated = applicationService.updateApplicationStatus(applicationId, status, recruiterId);
        return ResponseEntity.ok(updated);
    }
}