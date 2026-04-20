# Go-Live Checklist

This checklist tracks the 7 production pillars for this repo.

## 1. Secrets and Security Hardening
- [x] Internal service token guards for internal APIs.
- [x] Request body limit and secure response headers in bootstrap.
- [ ] Move all secrets to a real secret manager (AWS/GCP/Vault).
- [ ] Add automated secret rotation policy.
- [ ] Enforce TLS termination and mTLS for service-to-service traffic.

## 2. Critical Flow Automated Testing
- [x] Baseline unit test for profile response safety.
- [ ] Add E2E tests for checkout -> payment intent -> webhook -> order finalization.
- [ ] Add contract tests between order/payment/inventory internal APIs.

## 3. Observability
- [x] Request id and latency logs via shared interceptor.
- [x] Payment and order async flows emit logs for events and failures.
- [ ] Add centralized log aggregation and alerting.
- [ ] Add metrics backend + dashboards (error rate, p95 latency, queue depth).
- [ ] Add distributed tracing across services.

## 4. Operational Reliability
- [x] DB backup and restore scripts.
- [ ] Automated daily backups + retention + restore drill schedule.
- [ ] Migration rollback runbook rehearsed in staging.

## 5. Queue Reliability
- [x] Retry and DLQ flow in shared RabbitMQ client.
- [x] Idempotent consumer in order-service.
- [x] DLQ replay script.
- [ ] Outbox dispatcher pattern for guaranteed publish-after-commit.
- [ ] Scheduled reconciliation worker for stuck orders/events.

## 6. Performance and Capacity Validation
- [x] k6 load scripts for inventory, order checkout, and payment intents.
- [ ] Define target SLOs and max capacity per service.
- [ ] Run load tests in CI nightly/staging with trend reporting.

## 7. Compliance and Access Control
- [x] Access-control static audit script for internal routes.
- [x] Safe DTO-based response serialization for user profile APIs.
- [ ] Formal threat model + PII data flow map.
- [ ] Audit logging for privileged actions.
- [ ] Dependency and container vulnerability patch cadence.
