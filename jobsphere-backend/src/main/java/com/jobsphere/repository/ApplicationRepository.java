package com.jobsphere.repository;
import com.jobsphere.entity.Application;
import com.jobsphere.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByApplicantId(Long applicantId);

    List<Application> findByJobId(Long jobId);
    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);
    List<Application> findByApplicantIdOrderByAppliedAtDesc(Long applicantId);


    @Modifying
    @Query("UPDATE Application a SET a.status = :status WHERE a.id = :applicationId")
    void updateApplicationStatus(@Param("applicationId") Long applicationId,
                                 @Param("status") ApplicationStatus status);

    List<Application> findByJobPostedByIdOrderByAppliedAtDesc(Long recruiterId);
}