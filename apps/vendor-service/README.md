# vendor-service

## Purpose
Vendor onboarding and vendor account domain.

## Main APIs
- `POST /v1/vendors/register`
- `POST /v1/vendors/login`
- `GET /v1/vendors/me`
- `GET /v1/vendors`
- `PATCH /v1/vendors/:id/status`

## Responsibilities
- Vendor registration and lifecycle status management.
- Vendor login orchestration through auth-service.
- Stripe Connect account onboarding orchestration via payment-service.

## Dependencies
- auth-service (role updates/login)
- payment-service (connect account + onboarding links)
- PostgreSQL (`vendor_profile` entity)

## Run
- `npm run start:vendor`
- Default port: `3005`

## Health
- `/`, `/health`, `/ready`
