# inventory-service

## Purpose
Inventory and reservation domain.

## Main APIs
- `GET /v1/inventory/product/:productId`
- `POST /v1/inventory/product/:productId`
- `PATCH /v1/inventory/product/:productId`
- `POST /v1/inventory/product/:productId/adjust`
- `POST /v1/inventory/product/:productId/reservations`
- `POST /v1/inventory/product/:productId/reservations/:reservationId/confirm`
- `POST /v1/inventory/product/:productId/reservations/:reservationId/release`

## Internal APIs
- `POST /v1/inventory/internal/product/:productId/reservations`
- `POST /v1/inventory/internal/product/:productId/reservations/:reservationId/confirm`
- `POST /v1/inventory/internal/product/:productId/reservations/:reservationId/release`

## Responsibilities
- Maintains stock and low-stock states.
- Handles checkout reservations and release/confirm lifecycle.
- Supports internal token-guarded reservation APIs for async order saga flow.

## Dependencies
- PostgreSQL (`inventory`, `inventory_reservations`)
- Redis optional reservation path

## Redis And RabbitMQ Usage
- Redis: actively used when `USE_REDIS_RESERVATION_PATH=true`.
  - Reservation fast path with atomic Lua operations.
  - Mirror synchronization with DB on reserve/release/confirm.
  - Falls back to DB transaction path if Redis path is disabled.
- RabbitMQ: not used directly in inventory-service currently.
  - Inventory is driven by HTTP/internal APIs from order-service.

## Run
- `npm run start:inventory`
- Default port: `3004`

## Health
- `/`, `/health`, `/ready`
