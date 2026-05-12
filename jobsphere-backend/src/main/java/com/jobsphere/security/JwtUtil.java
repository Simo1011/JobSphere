package com.jobsphere.security;

import com.jobsphere.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // Strong Secret Key (64+ characters) - Good for development
    private final SecretKey secretKey = Keys.hmacShaKeyFor(
            "JobSphere2026SuperSecretKeyForJWTAuthenticationNewYorkProjectMakeItVeryLongAndSecure123456789"
                    .getBytes()
    );

    /**
     * Generate JWT Token
     */
    public String generateToken(String email, Long userId, Role role) {
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role.name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours valid
                .signWith(secretKey)
                .compact();
    }

    /**
     * Extract Email from Token
     */
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    /**
     * Extract User ID from Token
     */
    public Long extractUserId(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("userId", Long.class);
    }

    /**
     * Extract Role from Token
     */
    public Role extractRole(String token) {
        String roleStr = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
        return Role.valueOf(roleStr);
    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(String token) {
        try {
            Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}