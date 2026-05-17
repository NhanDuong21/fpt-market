# Product Roadmap

The development of FPT-Market is divided into strategic phases to ensure a stable, scalable rollout.

## Phase 1: Foundation and Core Marketplace (Current)
*Focus: Establishing the monorepo architecture and core e-commerce functionalities.*

- [x] Monorepo setup (`/client`, `/server`, `/docs`).
- [x] Implement robust Authentication & JWT lifecycle.
- [x] Build Product Catalog and Category navigation.
- [x] Implement Cart and Order Processing (with Snapshot pattern).
- [ ] Integrate VNPay Sandbox for checkout.
- [ ] Deploy MVP to Vercel (Frontend) and Render/Railway (Backend).

## Phase 2: Engagement and Expansion
*Focus: Enhancing user experience and adding alternative payment methods.*

- [ ] Implement Review & Rating module.
- [ ] Momo E-Wallet payment integration.
- [ ] Advanced product search with Elasticsearch (or robust SQL Full-Text).
- [x] Wishlist functionality (in progress).
- [x] Seller Portal: Allow users to submit products for admin approval.
- [x] Seller Order Dashboard: Isolated order views, status transition pipeline, and Vietnamese label translations.

## Phase 3: Analytics and Optimization
*Focus: Data-driven insights and performance scaling.*

- [x] Comprehensive Admin Dashboard (Basic CRUD and Approval workflow).
- [ ] Implement Redis caching for high-traffic endpoints.
- [ ] Automated inventory alerts and reporting.
- [x] Mobile-responsive layout refinement (Red/White theme redesign).
- [x] Phase 4.6 UI/UX Polish: Reusable EmptyState, SafeImage fallback wrappers, real-time Header cart counts, full Vietnamese order status translations, and Next.js Suspense pre-render fix.

## Phase 4: Microservices Transition (Future Consideration)
*Focus: Breaking down the monolith if scale demands.*

- [ ] Evaluate extracting the Order Processing and Payment modules into independent microservices.
- [ ] Implement Kafka/RabbitMQ for event-driven communication between services.
- [ ] Migrate from a single database to database-per-service architecture.
