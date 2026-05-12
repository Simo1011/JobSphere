package com.jobsphere.dto;

import com.jobsphere.entity.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDTO {

    private Long id;
    private Long jobId;
    private String jobTitle;           // for display
    private String companyName;        // for display
    private Long applicantId;
    private String applicantName;      // for display
    private ApplicationStatus status;
    private String resumeUrl;
    private String notes;
    private LocalDateTime appliedAt;
    private String location;
}