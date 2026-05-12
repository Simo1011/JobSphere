package com.jobsphere.mapper;

import com.jobsphere.dto.ApplicationDTO;
import com.jobsphere.dto.JobDTO;
import com.jobsphere.dto.UserDTO;
import com.jobsphere.entity.Application;
import com.jobsphere.entity.Job;
import com.jobsphere.entity.User;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    public UserDTO toUserDTO(User user) {
        if (user == null) return null;
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .resumeUrl(user.getResumeUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public JobDTO toJobDTO(Job job) {
        if (job == null) return null;

        return JobDTO.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .createdAt(job.getCreatedAt())
                // Safe mapping with null check
                .postedById(job.getPostedBy() != null ? job.getPostedBy().getId() : null)
                .postedByName(job.getPostedBy() != null ? job.getPostedBy().getFullName() : null)
                .build();
    }

    public ApplicationDTO toApplicationDTO(Application application) {
        if (application == null) return null;
        return ApplicationDTO.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .jobTitle(application.getJob().getTitle())
                .companyName(application.getJob().getCompanyName())
                .location(application.getJob().getLocation())   // ← Add this line
                .applicantId(application.getApplicant().getId())
                .applicantName(application.getApplicant().getFullName())
                .status(application.getStatus())
                .resumeUrl(application.getResumeUrl())
                .notes(application.getNotes())
                .appliedAt(application.getAppliedAt())
                .build();
    }

    // Add this helper method in the Mapper class
    private String buildFullResumeUrl(String resumeUrl) {
        if (resumeUrl == null || resumeUrl.isEmpty()) {
            return null;
        }
        return "http://localhost:8080" + resumeUrl;
    }
}