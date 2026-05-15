package com.fptmarket.config;

import com.fptmarket.entity.Role;
import com.fptmarket.entity.Status;
import com.fptmarket.entity.User;
import com.fptmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@fpt.edu.vn")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@fpt.edu.vn")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(Status.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin user: admin@fpt.edu.vn / admin123");
        }
    }
}
