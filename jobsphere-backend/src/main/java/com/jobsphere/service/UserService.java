package com.jobsphere.service;

import com.jobsphere.dto.LoginResponse;
import com.jobsphere.dto.RegisterRequest;
import com.jobsphere.dto.UserDTO;
import com.jobsphere.entity.Role;
import com.jobsphere.entity.User;
import com.jobsphere.exception.BadRequestException;
import com.jobsphere.exception.ResourceNotFoundException;
import com.jobsphere.mapper.Mapper;
import com.jobsphere.repository.UserRepository;
import com.jobsphere.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserDTO registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.SEEKER)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .build();

        User savedUser = userRepository.save(user);
        return mapper.toUserDTO(savedUser);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}