# order-service

## Purpose
Checkout orchestration and order lifecycle service.

## Main APIs
- `POST /v1/orders/checkout`
- `PATCH /v1/orders/:id/confirm`
- `PATCH /v1/orders/:id/cancel`
- `GET /v1/orders/:id`
- `GET /v1/orders`

## Responsibilities
- Multi-item checkout orchestration.
- Inventory reservation + release/confirm orchestration.
- Pending order creation and payment intent association.
- Async payment-event consumption from RabbitMQ with idempotent processing.

## Dependencies
- PostgreSQL (`orders`, `order_items`, `processed_events`)
- inventory-service, catalog-service, payment-service (shared clients)
- RabbitMQ (payment event consumption)

## Redis And RabbitMQ Usage
- RabbitMQ: actively used.
  - Consumes `payment.intent.*` events from exchange `ecommerce.events`.
  - Retries + DLQ handling via shared RabbitMQ client.
  - Idempotency enforced with `processed_events` table.
- Redis: not currently a primary dependency in order domain logic.
  - `CacheModule` exists at app level for shared platform baseline.

## Run
- `npm run start:order`
- Default port: `3009`

## Health
- `/`, `/health`, `/ready`
