package com.jobsphere.dto;


import com.jobsphere.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private Role role;
    private String fullName;
    private String phone;
    private String resumeUrl;
    private LocalDateTime createdAt;
}