package com.jobsphere.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import com.jobsphere.dto.ApplicationDTO;
import com.jobsphere.dto.JobWithApplicationsDTO;
import com.jobsphere.entity.Application;
import com.jobsphere.entity.ApplicationStatus;
import com.jobsphere.entity.Job;
import com.jobsphere.entity.User;
import com.jobsphere.exception.ResourceNotFoundException;
import com.jobsphere.mapper.Mapper;
import com.jobsphere.repository.ApplicationRepository;
import com.jobsphere.repository.JobRepository;
import com.jobsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final Mapper mapper;               // ← Injected Mapper



    /**
     * Recruiter updates the status of an application
     */
    public ApplicationDTO updateApplicationStatus(Long applicationId, ApplicationStatus newStatus, Long recruiterId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Security check: Only the recruiter who posted the job can update status
        if (!application.getJob().getPostedBy().getId().equals(recruiterId)) {
            throw new RuntimeException("You can only update applications for your own jobs");
        }

        application.setStatus(newStatus);
        Application updated = applicationRepository.save(application);

        return mapper.toApplicationDTO(updated);
    }
    private String buildFullResumeUrl(String resumeUrl) {
        if (resumeUrl == null || resumeUrl.isEmpty()) {
            return null;
        }
        // Change this base URL if you deploy to production later
        return "http://localhost:8080" + resumeUrl;
    }

    public ApplicationDTO applyToJob(Long jobId, Long applicantId, MultipartFile resumeFile) throws IOException {


        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + applicantId));

        if (applicationRepository.existsByJobIdAndApplicantId(jobId, applicantId)) {
            throw new RuntimeException("You have already applied to this job");
        }

        if (applicant.getRole() != com.jobsphere.entity.Role.SEEKER) {
            throw new RuntimeException("Only job seekers can apply to jobs");
        }

        String resumeUrl = null;

        // Handle resume upload
        if (resumeFile != null && !resumeFile.isEmpty()) {
            if (!"application/pdf".equals(resumeFile.getContentType())) {
                throw new RuntimeException("Only PDF files are allowed for resume");
            }

            // Create directory if not exists
            String uploadDir = "src/main/resources/uploads/resumes/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String fileName = applicantId + "_" + jobId + "_" + System.currentTimeMillis() + ".pdf";
            Path filePath = Paths.get(uploadDir + fileName);

            // Save file
            Files.copy(resumeFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            resumeUrl = "/uploads/resumes/" + fileName;
        }

        Application application = Application.builder()
                .job(job)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .resumeUrl(resumeUrl)
                .appliedAt(LocalDateTime.now())
                .build();

        Application savedApplication = applicationRepository.save(application);

        return mapper.toApplicationDTO(savedApplication);
    }

    public List<ApplicationDTO> getMyApplications(Long applicantId) {
        List<Application> applications = applicationRepository.findByApplicantIdOrderByAppliedAtDesc(applicantId);

        return applications.stream()
                .map(mapper::toApplicationDTO)        // ← Clean usage of Mapper
                .collect(Collectors.toList());
    }

    /**
     * Recruiter - See all applications received on their posted jobs
     */
    /**
     * Recruiter - See ALL posted jobs (including those with 0 applications)
     */
    public List<JobWithApplicationsDTO> getApplicationsReceived(Long recruiterId) {
        // 1. Get ALL jobs posted by this recruiter (including zero applications)
        List<Job> jobs = jobRepository.findByPostedByIdOrderByCreatedAtDesc(recruiterId);

        return jobs.stream().map(job -> {
            // 2. Get applications for this specific job
            List<Application> jobApps = applicationRepository.findByJobId(job.getId());

            // 3. Convert applications to DTOs using Mapper
            List<ApplicationDTO> appDTOs = jobApps.stream()
                    .map(mapper::toApplicationDTO)
                    .collect(Collectors.toList());

            // 4. Build the DTO
            return JobWithApplicationsDTO.builder()
                    .jobId(job.getId())
                    .jobTitle(job.getTitle())
                    .companyName(job.getCompanyName())
                    .location(job.getLocation())
                    .totalApplications(jobApps.size())
                    .applications(appDTOs)
                    .createdAt(job.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }


}