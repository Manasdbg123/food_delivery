package com.platform.auth.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "auth_credentials")
@Data
public class UserCredentials {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String email;
    private String passwordHash;
    private String role;
}
