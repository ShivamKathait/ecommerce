# Access Control Matrix

## Public and Authenticated APIs
- `auth-service`: register/login APIs.
- `user-service`: profile APIs require JWT + role guards.
- `catalog-service`, `inventory-service`, `order-service`: guarded per role.

## Internal Service APIs
- `payment-service`: guarded by `InternalServiceGuard` with `x-internal-token`.
- `inventory-service` internal reservation routes: guarded by `InternalServiceGuard`.

## Required Controls
- Internal token must be configured per environment and not checked into git.
- Internal routes must never be exposed through public gateway without additional auth.
- Any new `/internal/*` route must include `InternalServiceGuard`.

## Verification
Run:

```bash
npm run audit:access-control
```
