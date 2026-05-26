package com.fptmarket.config;

import com.fptmarket.entity.*;
import com.fptmarket.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.enabled:false}")
    private boolean seedEnabled;

    public DatabaseSeeder(UserRepository userRepository,
                          CategoryRepository categoryRepository,
                          ProductRepository productRepository,
                          ProductImageRepository productImageRepository,
                          CartRepository cartRepository,
                          CartItemRepository cartItemRepository,
                          OrderRepository orderRepository,
                          OrderItemRepository orderItemRepository,
                          PaymentRepository paymentRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (!seedEnabled) {
            log.info("Database seeding is disabled.");
            return;
        }

        if (userRepository.existsByEmail("admin@fpt.edu.vn")) {
            log.info("Seed data already exists, skipping...");
            return;
        }

        log.info("Starting database seeding...");

        // Phase 1: Users
        User admin = User.builder()
                .fullName("System Admin")
                .email("admin@fpt.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .phone("0987654321")
                .role(Role.ADMIN)
                .status(Status.ACTIVE)
                .build();
        admin = userRepository.save(admin);

        User seller1 = User.builder()
                .fullName("Seller One")
                .email("seller1@fpt.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .phone("0987654322")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
        seller1 = userRepository.save(seller1);

        User seller2 = User.builder()
                .fullName("Seller Two")
                .email("seller2@fpt.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .phone("0987654323")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
        seller2 = userRepository.save(seller2);

        User buyer1 = User.builder()
                .fullName("Buyer One")
                .email("buyer1@fpt.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .phone("0987654324")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
        buyer1 = userRepository.save(buyer1);

        User buyer2 = User.builder()
                .fullName("Buyer Two")
                .email("buyer2@fpt.edu.vn")
                .password(passwordEncoder.encode("123456"))
                .phone("0987654325")
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();
        buyer2 = userRepository.save(buyer2);

        // Phase 2: Categories
        List<Category> categories = new ArrayList<>();
        String[][] categoryData = {
                {"Giáo trình", "giao-trinh", "Sách, giáo trình học tập dành cho sinh viên"},
                {"Laptop", "laptop", "Máy tính xách tay phục vụ học tập và làm việc"},
                {"Điện thoại", "dien-thoai", "Điện thoại di động các hãng"},
                {"Phụ kiện", "phu-kien", "Chuột, bàn phím, tai nghe, dây cáp sạc"},
                {"Đồ ký túc xá", "do-ky-tuc-xa", "Quạt, đèn học, ấm siêu tốc, tủ vải đồ cá nhân"},
                {"Đồ học tập", "do-hoc-tap", "Bảng vẽ, máy tính Casio, sổ tay, bút thước"},
                {"Xe đạp", "xe-dap", "Xe đạp thể thao, xe đạp mini đi quanh trường"},
                {"Thời trang sinh viên", "thoi-trang-sinh-vien", "Áo hoodie, balo, giày thể thao unisex"},
                {"Dịch vụ sinh viên", "dich-vu-sinh-vien", "Cài win, vệ sinh laptop, gia sư lập trình"},
                {"Khác", "khac", "Các đồ dùng linh tinh khác của sinh viên"}
        };

        for (String[] data : categoryData) {
            Category cat = Category.builder()
                    .name(data[0])
                    .slug(data[1])
                    .description(data[2])
                    .build();
            categories.add(categoryRepository.save(cat));
        }

        // Phase 3: Products & Images
        if (productRepository.count() > 0) {
            log.info("Products already exist, skipping product seeding.");
            return;
        }

        List<Product> products = new ArrayList<>();
        // We will seed exactly 30 products
        String[][] productData = {
                // Giáo trình (Cat index 0)
                {"Giáo trình Triết học Mác-Lênin", "giao-trinh-triet-hoc-mac-lenin", "Giáo trình chính thống dùng cho sinh viên FPT kì 1.", "30000", "5", "USED", "APPROVED", "1"},
                {"Giáo trình Toán cao cấp", "giao-trinh-toan-cao-cap", "Sách bài tập và lý thuyết toán cao cấp đầy đủ.", "50000", "3", "USED", "APPROVED", "1"},
                {"Giáo trình Kỹ nghệ phần mềm", "giao-trinh-ky-nghe-phan-mem", "Giáo trình bản đẹp không nhàu nát môn SWE.", "70000", "2", "USED", "PENDING", "1"},
                // Laptop (Cat index 1)
                {"Laptop Dell Latitude E7470 cũ", "laptop-dell-latitude-e7470-cu", "Laptop văn phòng core i5, RAM 8GB, SSD 256GB mượt mà.", "5000000", "1", "USED", "APPROVED", "1"},
                {"Laptop Asus ROG Strix G15", "laptop-asus-rog-strix-g15", "Laptop gaming cao cấp Ryzen 7, RTX 3050, bảo hành 6 tháng.", "15000000", "2", "NEW", "APPROVED", "1"},
                {"Laptop MacBook Air M1 2020", "laptop-macbook-air-m1-2020", "MacBook Air M1 bản 8GB/256GB màu xám không trầy xước.", "12000000", "1", "USED", "APPROVED", "1"},
                // Điện thoại (Cat index 2)
                {"Điện thoại iPhone 11 64GB", "dien-thoai-iphone-11-64gb", "Máy quốc tế, pin 85%, mọi chức năng FaceID đầy đủ.", "4000000", "1", "USED", "REJECTED", "1"},
                {"Điện thoại Samsung Galaxy S20", "dien-thoai-samsung-galaxy-s20", "Màn hình 120Hz siêu mượt, chip Snapdragon khoẻ.", "6000000", "2", "USED", "APPROVED", "1"},
                {"Điện thoại Xiaomi Redmi Note 10", "dien-thoai-xiaomi-redmi-note-10", "Pin 5000mAh trâu bò, thích hợp cho sinh viên chạy xe công nghệ.", "3000000", "3", "USED", "APPROVED", "1"},
                // Phụ kiện (Cat index 3)
                {"Chuột không dây Logitech M331", "chuot-khong-day-logitech-m331", "Chuột silent giảm tiếng ồn, nhạy bén cực kì thích hợp học KTX.", "150000", "10", "NEW", "PENDING", "1"},
                {"Bàn phím cơ DareU EK87", "ban-phim-co-dareu-ek87", "Bàn phím cơ Blue Switch gõ đầm tay, đầy đủ hộp phụ kiện.", "250000", "4", "USED", "APPROVED", "1"},
                {"Tai nghe Bluetooth Sony WH-CH510", "tai-nghe-bluetooth-sony-wh-ch510", "Tai nghe chụp tai pin trâu 35 tiếng nghe nhạc giải trí cực phê.", "350000", "1", "USED", "SOLD", "1"},
                // Đồ ký túc xá (Cat index 4)
                {"Quạt mini để bàn KTX", "quat-mini-de-ban-ktx", "Quạt sạc pin USB tiện lợi khi mất điện tại Hoà Lạc.", "100000", "6", "NEW", "APPROVED", "1"},
                {"Đèn học chống cận để bàn", "den-hoc-chong-can-de-ban", "Đèn có 3 chế độ sáng bảo vệ mắt khi cày deadline đêm.", "120000", "4", "USED", "REJECTED", "1"},
                {"Ấm siêu tốc 1.8L inox", "am-sieu-toc-18l-inox", "Ấm đun nước sôi nhanh chóng siêu tốc tiết kiệm thời gian.", "80000", "5", "NEW", "APPROVED", "1"},
                // Đồ học tập (Cat index 5)
                {"Bảng vẽ điện tử Huion H430P", "bang-ve-dien-tu-huion-h430p", "Bảng vẽ OSU hoặc vẽ digital painting cơ bản cho sinh viên đồ hoạ.", "200000", "2", "USED", "APPROVED", "2"},
                {"Máy tính bỏ túi Casio fx-580VN X", "may-tinh-bo-tui-casio-fx-580vn-x", "Máy tính chuyên dụng giải toán ma trận, tích phân siêu nhanh.", "350000", "8", "NEW", "APPROVED", "2"},
                {"Sổ tay ghi chép da PU A5", "so-tay-ghi-chep-da-pu-a5", "Sổ tay cao cấp kèm bút ký sang trọng phục vụ học tập.", "45000", "15", "NEW", "PENDING", "2"},
                // Xe đạp (Cat index 6)
                {"Xe đạp thể thao Asama cũ", "xe-dap-the-thao-asama-cu", "Xe đạp thể thao di chuyển nhẹ nhàng quanh campus đại học FPT.", "800000", "1", "USED", "APPROVED", "2"},
                {"Xe đạp địa hình Giant ATX", "xe-dap-dia-hinh-giant-atx", "Xe nhập khẩu nguyên chiếc xịn sò đi cực đầm và chắc chắn.", "2500000", "1", "USED", "APPROVED", "2"},
                {"Xe đạp mini thời trang", "xe-dap-mini-thoi-trang", "Xe mini Nhật bền đẹp thích hợp cho các bạn nữ.", "600000", "2", "USED", "APPROVED", "2"},
                // Thời trang sinh viên (Cat index 7)
                {"Áo khoác hoodie FPT Unisex", "ao-khoac-hoodie-fpt-unisex", "Hoodie nỉ dày dặn ấm áp in logo FPT cá tính.", "180000", "12", "NEW", "APPROVED", "2"},
                {"Balo đi học chống nước", "balo-di-hoc-chong-nuoc", "Balo rộng rãi đựng vừa laptop 15.6 inch có ngăn chống sốc.", "220000", "5", "NEW", "APPROVED", "2"},
                {"Giày sneaker trắng nam nữ", "giay-sneaker-trang-nam-nu", "Giày basic dễ phối đồ, êm chân cho các buổi học thể chất.", "250000", "3", "NEW", "APPROVED", "2"},
                // Dịch vụ sinh viên (Cat index 8)
                {"Dịch vụ cài win và vệ sinh laptop", "dich-vuj-cai-win-va-ve-sinh-laptop", "Nhận cài Windows 10/11, vệ sinh keo tản nhiệt MX-4 cho laptop.", "50000", "99", "NEW", "REJECTED", "2"},
                {"Dịch vụ gia sư lập trình Java", "dich-vu-gia-su-lap-trinh-java", "Hỗ trợ học môn PRO192, PRJ301 cam kết qua môn điểm cao.", "150000", "99", "NEW", "APPROVED", "2"},
                {"Dịch vụ chụp ảnh thẻ lấy ngay", "dich-vu-chup-anh-the-lay-ngay", "Chụp ảnh thẻ nộp hồ sơ, có chỉnh sửa photoshop nhẹ nhàng.", "30000", "99", "NEW", "APPROVED", "2"},
                // Khác (Cat index 9)
                {"Móc khóa FPT polymer siêu bền", "moc-khoa-fpt-polymer-sieu-ben", "Móc khóa xinh xắn treo balo chống thất lạc chìa khóa.", "25000", "50", "NEW", "SOLD", "2"},
                {"Bình giữ nhiệt Lock&Lock 500ml", "binh-giu-nhiet-lock-lock-500ml", "Bình giữ nhiệt cao cấp giữ nóng lạnh trên 12 tiếng.", "120000", "10", "NEW", "APPROVED", "2"},
                {"Giá treo tai nghe bằng gỗ", "gia-treo-tai-nghe-bang-go", "Giá đỡ tai nghe chụp tai decor góc học tập siêu xinh.", "75000", "8", "NEW", "APPROVED", "2"}
        };

        int count = 0;
        for (String[] data : productData) {
            String name = data[0];
            String slug = data[1];
            String desc = data[2];
            BigDecimal price = new BigDecimal(data[3]);
            Integer qty = Integer.parseInt(data[4]);
            ConditionType cond = ConditionType.valueOf(data[5]);
            ProductStatus stat = ProductStatus.valueOf(data[6]);
            int sellerIndex = Integer.parseInt(data[7]); // 1 -> seller1, 2 -> seller2

            Category category = categories.get(count / 3);
            User seller = (sellerIndex == 1) ? seller1 : seller2;

            Product product = Product.builder()
                    .name(name)
                    .slug(slug)
                    .description(desc)
                    .price(price)
                    .quantity(qty)
                    .conditionType(cond)
                    .status(stat)
                    .category(category)
                    .user(seller)
                    .build();

            if (count == 4) {
                // Asus ROG Strix G15 - 4 images
                ProductImage img1 = ProductImage.builder().imageUrl("/brand/logo-icon.png").product(product).build();
                ProductImage img2 = ProductImage.builder().imageUrl("/brand/logo-group.png").product(product).build();
                ProductImage img3 = ProductImage.builder().imageUrl("/images/product-placeholder.png").product(product).build();
                ProductImage img4 = ProductImage.builder().imageUrl("/brand/logo-icon.png").product(product).build();
                product.addImage(img1);
                product.addImage(img2);
                product.addImage(img3);
                product.addImage(img4);
            } else if (count == 28) {
                // Bình giữ nhiệt Lock&Lock 500ml - 3 images
                ProductImage img1 = ProductImage.builder().imageUrl("/images/product-placeholder.png").product(product).build();
                ProductImage img2 = ProductImage.builder().imageUrl("/brand/logo-icon.png").product(product).build();
                ProductImage img3 = ProductImage.builder().imageUrl("/brand/logo-group.png").product(product).build();
                product.addImage(img1);
                product.addImage(img2);
                product.addImage(img3);
            } else {
                // Regular product - 1 image
                ProductImage img = ProductImage.builder().imageUrl("/images/product-placeholder.png").product(product).build();
                product.addImage(img);
            }

            products.add(productRepository.save(product));
            count++;
        }

        // Phase 4: Carts
        Cart adminCart = Cart.builder().user(admin).build();
        cartRepository.save(adminCart);

        Cart seller1Cart = Cart.builder().user(seller1).build();
        cartRepository.save(seller1Cart);

        Cart seller2Cart = Cart.builder().user(seller2).build();
        cartRepository.save(seller2Cart);

        Cart buyer1Cart = Cart.builder().user(buyer1).build();
        cartRepository.save(buyer1Cart);

        Cart buyer2Cart = Cart.builder().user(buyer2).build();
        cartRepository.save(buyer2Cart);

        List<Product> activeProducts = products.stream()
                .filter(p -> p.getStatus() == ProductStatus.APPROVED && p.getQuantity() > 0)
                .toList();

        if (activeProducts.size() >= 2) {
            Product p1 = activeProducts.get(0);
            Product p2 = activeProducts.get(1);

            CartItem ci1 = CartItem.builder()
                    .cart(buyer1Cart)
                    .product(p1)
                    .quantity(1)
                    .build();
            buyer1Cart.addItem(ci1);

            CartItem ci2 = CartItem.builder()
                    .cart(buyer1Cart)
                    .product(p2)
                    .quantity(2)
                    .build();
            buyer1Cart.addItem(ci2);

            cartRepository.save(buyer1Cart);
        }

        // Phase 5: Orders & Payments
        final Long s1Id = seller1.getId();
        final Long s2Id = seller2.getId();

        Product s1Product1 = activeProducts.stream().filter(p -> p.getUser().getId().equals(s1Id)).findFirst().orElse(null);
        final Long s1p1Id = s1Product1 != null ? s1Product1.getId() : -1L;

        if (s1Product1 != null) {
            Order order1 = Order.builder()
                    .user(buyer1)
                    .fullName(buyer1.getFullName())
                    .phone(buyer1.getPhone())
                    .shippingAddress("Khu CNC Hòa Lạc, Thạch Thất, Hà Nội")
                    .totalAmount(s1Product1.getPrice().multiply(BigDecimal.valueOf(2)))
                    .status(OrderStatus.PENDING)
                    .paymentMethod(PaymentMethod.COD)
                    .build();
            OrderItem oi1 = OrderItem.builder()
                    .order(order1)
                    .product(s1Product1)
                    .productName(s1Product1.getName())
                    .price(s1Product1.getPrice())
                    .imageUrl(s1Product1.getImages().isEmpty() ? null : s1Product1.getImages().get(0).getImageUrl())
                    .quantity(2)
                    .subtotal(s1Product1.getPrice().multiply(BigDecimal.valueOf(2)))
                    .build();
            order1.addItem(oi1);
            order1 = orderRepository.save(order1);

            Payment payment1 = Payment.builder()
                    .order(order1)
                    .paymentMethod(PaymentMethod.COD)
                    .paymentStatus(PaymentStatus.PENDING)
                    .amount(order1.getTotalAmount())
                    .build();
            paymentRepository.save(payment1);
        }

        Product s1Product2 = activeProducts.stream().filter(p -> p.getUser().getId().equals(s1Id) && !p.getId().equals(s1p1Id)).findFirst().orElse(null);
        if (s1Product2 != null) {
            Order order2 = Order.builder()
                    .user(buyer1)
                    .fullName(buyer1.getFullName())
                    .phone(buyer1.getPhone())
                    .shippingAddress("Khu CNC Hòa Lạc, Thạch Thất, Hà Nội")
                    .totalAmount(s1Product2.getPrice())
                    .status(OrderStatus.CONFIRMED)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .build();
            OrderItem oi2 = OrderItem.builder()
                    .order(order2)
                    .product(s1Product2)
                    .productName(s1Product2.getName())
                    .price(s1Product2.getPrice())
                    .imageUrl(s1Product2.getImages().isEmpty() ? null : s1Product2.getImages().get(0).getImageUrl())
                    .quantity(1)
                    .subtotal(s1Product2.getPrice())
                    .build();
            order2.addItem(oi2);
            order2 = orderRepository.save(order2);

            Payment payment2 = Payment.builder()
                    .order(order2)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .paymentStatus(PaymentStatus.PAID)
                    .amount(order2.getTotalAmount())
                    .transactionNo("VNP12345678")
                    .bankCode("NCB")
                    .paidAt(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment2);
        }

        Product s2Product1 = activeProducts.stream().filter(p -> p.getUser().getId().equals(s2Id)).findFirst().orElse(null);
        final Long s2p1Id = s2Product1 != null ? s2Product1.getId() : -1L;

        if (s2Product1 != null) {
            Order order3 = Order.builder()
                    .user(buyer1)
                    .fullName(buyer1.getFullName())
                    .phone(buyer1.getPhone())
                    .shippingAddress("Khu CNC Hòa Lạc, Thạch Thất, Hà Nội")
                    .totalAmount(s2Product1.getPrice())
                    .status(OrderStatus.SHIPPING)
                    .paymentMethod(PaymentMethod.COD)
                    .build();
            OrderItem oi3 = OrderItem.builder()
                    .order(order3)
                    .product(s2Product1)
                    .productName(s2Product1.getName())
                    .price(s2Product1.getPrice())
                    .imageUrl(s2Product1.getImages().isEmpty() ? null : s2Product1.getImages().get(0).getImageUrl())
                    .quantity(1)
                    .subtotal(s2Product1.getPrice())
                    .build();
            order3.addItem(oi3);
            order3 = orderRepository.save(order3);

            Payment payment3 = Payment.builder()
                    .order(order3)
                    .paymentMethod(PaymentMethod.COD)
                    .paymentStatus(PaymentStatus.PENDING)
                    .amount(order3.getTotalAmount())
                    .build();
            paymentRepository.save(payment3);
        }

        if (s1Product1 != null) {
            Order order4 = Order.builder()
                    .user(buyer2)
                    .fullName(buyer2.getFullName())
                    .phone(buyer2.getPhone())
                    .shippingAddress("Khu CNC Hòa Lạc, Thạch Thất, Hà Nội")
                    .totalAmount(s1Product1.getPrice())
                    .status(OrderStatus.COMPLETED)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .build();
            OrderItem oi4 = OrderItem.builder()
                    .order(order4)
                    .product(s1Product1)
                    .productName(s1Product1.getName())
                    .price(s1Product1.getPrice())
                    .imageUrl(s1Product1.getImages().isEmpty() ? null : s1Product1.getImages().get(0).getImageUrl())
                    .quantity(1)
                    .subtotal(s1Product1.getPrice())
                    .build();
            order4.addItem(oi4);
            order4 = orderRepository.save(order4);

            Payment payment4 = Payment.builder()
                    .order(order4)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .paymentStatus(PaymentStatus.PAID)
                    .amount(order4.getTotalAmount())
                    .transactionNo("VNP12345679")
                    .bankCode("NCB")
                    .paidAt(LocalDateTime.now())
                    .build();
            paymentRepository.save(payment4);
        }

        Product s2Product2 = activeProducts.stream().filter(p -> p.getUser().getId().equals(s2Id) && !p.getId().equals(s2p1Id)).findFirst().orElse(null);
        if (s2Product2 != null) {
            Order order5 = Order.builder()
                    .user(buyer2)
                    .fullName(buyer2.getFullName())
                    .phone(buyer2.getPhone())
                    .shippingAddress("Khu CNC Hòa Lạc, Thạch Thất, Hà Nội")
                    .totalAmount(s2Product2.getPrice())
                    .status(OrderStatus.CANCELLED)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .build();
            OrderItem oi5 = OrderItem.builder()
                    .order(order5)
                    .product(s2Product2)
                    .productName(s2Product2.getName())
                    .price(s2Product2.getPrice())
                    .imageUrl(s2Product2.getImages().isEmpty() ? null : s2Product2.getImages().get(0).getImageUrl())
                    .quantity(1)
                    .subtotal(s2Product2.getPrice())
                    .build();
            order5.addItem(oi5);
            order5 = orderRepository.save(order5);

            Payment payment5 = Payment.builder()
                    .order(order5)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .paymentStatus(PaymentStatus.CANCELLED)
                    .amount(order5.getTotalAmount())
                    .build();
            paymentRepository.save(payment5);
        }

        log.info("Seed data created successfully.");
    }
}
