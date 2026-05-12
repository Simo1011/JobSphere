package com.jobsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobWithApplicationsDTO {

    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private int totalApplications;
    private List<ApplicationDTO> applications;
    private LocalDateTime createdAt;
}