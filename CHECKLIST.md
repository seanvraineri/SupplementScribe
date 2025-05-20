# SupplementScribe Project Checklist

This checklist breaks down the technical audit and implementation plan into actionable, trackable tasks. Check off items as you complete them!

---

## 1. Core Architecture & Code Quality
- [ ] Refactor large components into smaller, reusable ones
- [ ] Enforce linting and formatting (ESLint, Prettier)
- [ ] Write unit tests for critical functions
- [ ] Optimize database schema (indexes, constraints)
- [ ] Review Supabase RLS policies for security

## 2. Authentication & User Management
- [ ] Implement Supabase Auth (email/password, Google OAuth)
- [ ] Create sign-up, login, and password reset flows
- [ ] Add email verification
- [ ] Implement user profile management (update info, delete account)
- [ ] Secure API routes and protected pages

## 3. AI Functionality
- [ ] Set up secure server-side AI API integration (OpenAI, etc.)
- [ ] Implement Personalized Plan Generator AI
  - [ ] Design prompt and output structure
  - [ ] Store plans in database
  - [ ] Include PubMed citations
- [ ] Implement AI Chatbot Expert
  - [ ] Context-aware chat with user plan
  - [ ] Stream chat responses
  - [ ] Maintain conversation history
- [ ] Add Research Citation Finder (optional)
- [ ] Add Budget Optimizer (optional)

## 4. Health & Fitness Integrations
- [ ] Integrate Fitbit OAuth and data sync
- [ ] Integrate Strava OAuth and webhook
- [ ] (Optional) Plan for Apple Health/Whoop integration
- [ ] Store and display fetched metrics

## 5. Genetic & Biomarker Data
- [ ] Build interface for genetic data upload (23andMe, etc.)
- [ ] Parse and store key SNPs
- [ ] Build interface for blood biomarker input/upload
- [ ] Store and use lab values in AI prompt
- [ ] Ensure privacy and user consent

## 6. Supplement E-Commerce Links
- [ ] Set up Amazon Affiliate account and API
- [ ] Implement product search and linking module
- [ ] Display "Buy" buttons on Results page
- [ ] Add affiliate disclosure to site
- [ ] (Optional) Integrate Fullscript/iHerb APIs
- [ ] Implement price comparison logic (optional)

## 7. Real-Time Notifications
- [ ] Create notifications table in Supabase
- [ ] Implement event-driven notifications (e.g., post-workout)
- [ ] Implement time-driven notifications (daily/weekly reminders)
- [ ] Set up Supabase Realtime subscriptions in frontend
- [ ] (Optional) Integrate push notifications (Expo, FCM, web push)
- [ ] Build notification center UI
- [ ] Allow user notification preferences

## 8. UI/UX & Performance
- [ ] Polish UI for mobile and desktop
- [ ] Add loading states and error handling
- [ ] Add visualizations (charts, gauges, etc.)
- [ ] Optimize image loading and bundle size
- [ ] Implement code splitting and caching

## 9. SEO, Analytics, and Compliance
- [ ] Add metadata and structured data
- [ ] Create sitemap
- [ ] Optimize for Core Web Vitals
- [ ] Set up analytics and conversion tracking
- [ ] Add privacy policy and terms of service
- [ ] Ensure compliance with affiliate and data privacy rules

## 10. Testing, QA, and Deployment
- [ ] Unit and integration tests for all major flows
- [ ] Cross-browser and device testing
- [ ] Security testing (RLS, XSS, etc.)
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment and monitoring
- [ ] Prepare backup and scaling strategy

---

*Update this checklist as you progress or as the plan evolves!* 