package com.jobsphere.dto;

import com.jobsphere.entity.JobType;
import com.jobsphere.entity.ExperienceLevel;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDTO {

    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private JobType jobType;
    private ExperienceLevel experienceLevel;
    private Long postedById;           // instead of full User object
    private String postedByName;       // helpful for frontend
    private LocalDateTime createdAt;
}