# payment-service

## Purpose
Payment boundary and Stripe integration service.

## Main APIs
- `POST /v1/payment/customers`
- `POST /v1/payment/connect/accounts`
- `GET /v1/payment/connect/accounts/:accountId`
- `POST /v1/payment/connect/accounts/:accountId/onboarding-links`
- `POST /v1/payment/intents`
- `GET /v1/payment/intents/:paymentIntentId`

## Responsibilities
- Creates Stripe customers, connect accounts, onboarding links.
- Creates/retrieves Stripe payment intents.
- Persists webhook payment history.
- Publishes normalized payment events to RabbitMQ.

## Dependencies
- Stripe
- PostgreSQL (`payment_history`)
- RabbitMQ (event publishing)
- Internal service token guard for API access

## Redis And RabbitMQ Usage
- RabbitMQ: actively used.
  - Publishes normalized payment events after webhook persistence.
  - Uses exchange routing (`payment.intent.*`) for order async processing.
- Redis: not used in payment domain logic currently.
  - No Redis-backed cache or queue workflow in payment-service yet.

## Run
- `npm run start:payment`
- Default port: `3006`

## Health
- `/`, `/health`, `/ready`
