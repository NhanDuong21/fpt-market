# Product Roadmap

The development of FPT-Market is divided into strategic phases to ensure a stable, scalable rollout.

## Phase 1: Foundation and Core Marketplace (Current)
*Focus: Establishing the monorepo architecture and core e-commerce functionalities.*

- [x] Monorepo setup (`/client`, `/server`, `/docs`).
- [ ] Implement robust Authentication & JWT lifecycle.
- [ ] Build Product Catalog and Category navigation.
- [ ] Implement Cart and Order Processing (with Snapshot pattern).
- [ ] Integrate VNPay Sandbox for checkout.
- [ ] Deploy MVP to Vercel (Frontend) and Render/Railway (Backend).

## Phase 2: Engagement and Expansion
*Focus: Enhancing user experience and adding alternative payment methods.*

- [ ] Implement Review & Rating module.
- [ ] Momo E-Wallet payment integration.
- [ ] Advanced product search with Elasticsearch (or robust SQL Full-Text).
- [ ] Wishlist functionality.
- [ ] Seller Portal: Allow users to submit products for admin approval.

## Phase 3: Analytics and Optimization
*Focus: Data-driven insights and performance scaling.*

- [ ] Comprehensive Admin Dashboard with charts and metrics.
- [ ] Implement Redis caching for high-traffic endpoints (e.g., category trees, top products).
- [ ] Automated inventory alerts and reporting.
- [ ] Mobile-responsive layout refinement and Progressive Web App (PWA) configuration.

## Phase 4: Microservices Transition (Future Consideration)
*Focus: Breaking down the monolith if scale demands.*

- [ ] Evaluate extracting the Order Processing and Payment modules into independent microservices.
- [ ] Implement Kafka/RabbitMQ for event-driven communication between services.
- [ ] Migrate from a single database to database-per-service architecture.
