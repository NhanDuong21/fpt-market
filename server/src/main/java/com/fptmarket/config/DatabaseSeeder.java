package com.fptmarket.config;

import com.fptmarket.entity.*;
import com.fptmarket.repository.CategoryRepository;
import com.fptmarket.repository.ProductRepository;
import com.fptmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedCategories();
        seedProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@fpt.edu.vn")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@fpt.edu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.ADMIN)
                    .status(Status.ACTIVE)
                    .build();
            userRepository.save(admin);
            log.info("Seeded admin user: admin@fpt.edu.vn");
        }

        if (!userRepository.existsByEmail("test@fpt.edu.vn")) {
            User user = User.builder()
                    .fullName("Test User")
                    .email("test@fpt.edu.vn")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.USER)
                    .status(Status.ACTIVE)
                    .build();
            userRepository.save(user);
            log.info("Seeded test user: test@fpt.edu.vn");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<String> categoryNames = Arrays.asList("Laptop", "Phone", "Book", "Accessory", "Service");
            for (String name : categoryNames) {
                Category category = Category.builder()
                        .name(name)
                        .slug(name.toLowerCase())
                        .description("Default description for " + name)
                        .build();
                categoryRepository.save(category);
            }
            log.info("Seeded categories: {}", categoryNames);
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            User testUser = userRepository.findByEmail("test@fpt.edu.vn").orElse(null);
            Category laptopCategory = categoryRepository.findBySlug("laptop").orElse(null);

            if (testUser != null && laptopCategory != null) {
                for (int i = 1; i <= 5; i++) {
                    Product product = Product.builder()
                            .name("Sample Product " + i)
                            .slug("sample-product-" + i)
                            .description("This is a sample product description for product " + i)
                            .price(new BigDecimal(100 * i))
                            .quantity(i)
                            .conditionType(ConditionType.NEW)
                            .status(ProductStatus.APPROVED)
                            .category(laptopCategory)
                            .user(testUser)
                            .build();
                    
                    ProductImage image = ProductImage.builder()
                            .imageUrl("https://via.placeholder.com/800x600?text=Product+" + i)
                            .product(product)
                            .build();
                    product.addImage(image);
                    
                    productRepository.save(product);
                }
                log.info("Seeded 5 sample products for test@fpt.edu.vn");
            }
        }
    }
}
