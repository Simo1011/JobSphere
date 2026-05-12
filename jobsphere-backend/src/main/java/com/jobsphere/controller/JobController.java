package com.jobsphere.controller;

import com.jobsphere.dto.JobDTO;
import com.jobsphere.entity.ExperienceLevel;
import com.jobsphere.entity.JobType;
import com.jobsphere.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {


    private final JobService jobService;

    // Create a new job (only recruiters can do this)
    @PostMapping
    public ResponseEntity<JobDTO> createJob(@RequestBody JobDTO jobDTO, Authentication authentication) {
        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long userId = (Long) authentication.getDetails();
        JobDTO createdJob = jobService.createJob(jobDTO, userId);
        return ResponseEntity.ok(createdJob);
    }
    @GetMapping
    public ResponseEntity<Page<JobDTO>> getAllJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobType jobType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<JobDTO> jobsPage = jobService.getJobsWithFiltersPaginated(
                keyword,
                location,
                jobType,
                experienceLevel,
                minSalary,
                page,
                size
        );

        return ResponseEntity.ok(jobsPage);
    }
    // Get single job by ID
    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable Long id) {
        JobDTO job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }
    /**
     * Get My Posted Jobs (for Recruiter only)
     */
    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobDTO>> getMyPostedJobs(Authentication authentication) {
        if (authentication == null || authentication.getDetails() == null) {
            return ResponseEntity.status(401).build();
        }

        Long recruiterId = (Long) authentication.getDetails();

        List<JobDTO> myJobs = jobService.getMyPostedJobs(recruiterId);
        return ResponseEntity.ok(myJobs);
    }
}