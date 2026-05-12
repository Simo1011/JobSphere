# JobSphere - Personal Technical Documentation

**Project**: Full-Stack Job Portal  
**Purpose**: Portfolio + Learning Project  
**Date**: May 2026  
**Developer**: Simo1011

---

## Architecture Diagram

```mermaid
flowchart TD
    subgraph Frontend [Frontend - React + TypeScript]
        A[UI Components] --> B[Pages: Jobs, MyPostedJobs, MyApplications, PostJob]
        B --> C[Axios API Calls]
        C --> D[JWT Token Management]
    end

    subgraph Backend [Backend - Spring Boot 3]
        E[Controllers] --> F[Services]
        F --> G[Repositories]
        G --> H[MySQL Database]
        
        I[Security Layer] --> E
        J[JWT Filter] --> I
        K[File Upload Handler] --> F
    end

    subgraph Database [MySQL]
        L[Users Table]
        M[Jobs Table]
        N[Applications Table]
    end

    Frontend -->|HTTP + JWT| Backend
    Backend --> Database
