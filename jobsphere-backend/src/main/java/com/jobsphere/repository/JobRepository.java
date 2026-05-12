package com.jobsphere.repository;

import com.jobsphere.entity.ExperienceLevel;
import com.jobsphere.entity.Job;
import com.jobsphere.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // For Recruiter's "My Posted Jobs"
    List<Job> findByPostedByIdOrderByCreatedAtDesc(Long postedById);

    // Basic pagination
    Page<Job> findAll(Pageable pageable);

    // ==================== FILTERING WITH PAGINATION ====================

    // Keyword search (title or description)
    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Job> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // Location search
    @Query("SELECT j FROM Job j WHERE LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    Page<Job> findByLocationContaining(@Param("location") String location, Pageable pageable);

    // Job Type filter with pagination
    Page<Job> findByJobType(JobType jobType, Pageable pageable);


    // Experience Level filter with pagination
    Page<Job> findByExperienceLevel(ExperienceLevel experienceLevel, Pageable pageable);

    // Minimum Salary filter with pagination
    Page<Job> findBySalaryMinGreaterThanEqual(BigDecimal salaryMin, Pageable pageable);



}