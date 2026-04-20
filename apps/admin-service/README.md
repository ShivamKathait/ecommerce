# admin-service

## Purpose
Admin domain service for admin authentication and admin-specific control endpoints.

## Main APIs
- `POST /v1/admin/login`

## Responsibilities
- Handles admin login flow by delegating auth to auth-service.
- Enforces role-based access for admin endpoints.

## Dependencies
- auth-service (via shared `AuthClientService`)
- PostgreSQL (service DB config)
- Redis (rate limit/cache baseline)

## Run
- `npm run start:admin`
- Default port: `3007`

## Health
- `/`, `/health`, `/ready`
