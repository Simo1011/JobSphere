package com.jobsphere.service;

import com.jobsphere.dto.JobDTO;
import com.jobsphere.entity.ExperienceLevel;
import com.jobsphere.entity.Job;
import com.jobsphere.entity.JobType;
import com.jobsphere.entity.User;
import com.jobsphere.exception.ResourceNotFoundException;
import com.jobsphere.mapper.Mapper;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;

    // ==================== CREATE JOB ====================
    public JobDTO createJob(JobDTO jobDTO, Long postedById) {
        User recruiter = userRepository.findById(postedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + postedById));

        // 🔥 ADD THIS ROLE CHECK
        if (recruiter.getRole() != com.jobsphere.entity.Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can post jobs");
        }

        Job job = Job.builder()
                .title(jobDTO.getTitle())
                .description(jobDTO.getDescription())
                .companyName(jobDTO.getCompanyName())
                .location(jobDTO.getLocation())
                .salaryMin(jobDTO.getSalaryMin())
                .salaryMax(jobDTO.getSalaryMax())
                .jobType(jobDTO.getJobType())
                .experienceLevel(jobDTO.getExperienceLevel())
                .postedBy(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapper.toJobDTO(savedJob);
    }

    // ==================== GET SINGLE JOB ====================
    public JobDTO getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapper.toJobDTO(job);
    }

    // ==================== GET MY POSTED JOBS ====================
    public List<JobDTO> getMyPostedJobs(Long recruiterId) {
        List<Job> jobs = jobRepository.findByPostedByIdOrderByCreatedAtDesc(recruiterId);
        return jobs.stream()
                .map(mapper::toJobDTO)
                .collect(Collectors.toList());
    }

    // ==================== MAIN METHOD: FILTERING + PAGINATION ====================
    /**
     * Get jobs with filters and pagination - supports keyword, location, etc.
     */
    public Page<JobDTO> getJobsWithFiltersPaginated(
            String keyword,
            String location,
            JobType jobType,
            ExperienceLevel experienceLevel,
            BigDecimal minSalary,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Job> jobPage;

        // Keyword search (title or description)
        if (keyword != null && !keyword.trim().isEmpty()) {
            jobPage = jobRepository.searchByKeyword(keyword.trim(), pageable);
        }
        // Location search - this should trigger when user types "New York"
        else if (location != null && !location.trim().isEmpty()) {
            jobPage = jobRepository.findByLocationContaining(location.trim(), pageable);
        }
        // Other filters
        else if (jobType != null) {
            jobPage = jobRepository.findByJobType(jobType, pageable);
        }
        else if (experienceLevel != null) {
            jobPage = jobRepository.findByExperienceLevel(experienceLevel, pageable);
        }
        else if (minSalary != null) {
            jobPage = jobRepository.findBySalaryMinGreaterThanEqual(minSalary, pageable);
        }
        // No filter - return all jobs
        else {
            jobPage = jobRepository.findAll(pageable);
        }

        return jobPage.map(mapper::toJobDTO);
    }
}