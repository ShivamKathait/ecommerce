# auth-service

## Purpose
Authentication boundary for user/admin/vendor login and registration.

## Main APIs
- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/login/admin`
- `POST /v1/auth/login/vendor`
- `PATCH /v1/auth/verify/otp`

## Responsibilities
- Creates users and manages OTP verification.
- Issues temp and access JWT tokens via shared auth library.
- Updates user roles for internal workflows.

## Dependencies
- PostgreSQL (`user`, `session` entities)
- Redis (session/cache via shared auth runtime)
- payment-service (customer creation through shared client)

## Run
- `npm run start:auth`
- Default port: `3008`

## Health
- `/`, `/health`, `/ready`
