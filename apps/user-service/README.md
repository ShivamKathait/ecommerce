# user-service

## Purpose
User profile domain service.

## Main APIs
- `GET /v1/users/me`
- `PATCH /v1/users/me`

## Responsibilities
- Returns authenticated user profile (safe response fields only).
- Updates profile data (currently `name`).

## Dependencies
- PostgreSQL (`user`, `session` entities)
- shared auth guards (`JwtAuthGuard`, `RolesGuard`)

## Run
- `npm run start:user`
- Default port: `3002`

## Health
- `/`, `/health`, `/ready`
