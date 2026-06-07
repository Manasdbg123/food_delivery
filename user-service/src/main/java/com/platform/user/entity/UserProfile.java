package com.platform.user.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "user_profiles")
@Data
public class UserProfile {
    @Id
    @Column(name = "user_id")
    private String userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
