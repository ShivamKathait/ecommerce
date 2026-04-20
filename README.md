# Ecommerce Monorepo

A NestJS ecommerce backend organized as an Nx monorepo with dedicated service apps and shared libraries.
## Current Architecture

```text
apps/
  auth-service/        Shared auth service app
  admin-service/       Admin login/auth domain
  user-service/        User domain service (profile/domain endpoints)
  vendor-service/      Vendor onboarding and vendor login domain
  catalog-service/     Product/catalog domain
  inventory-service/   Inventory/stock domain
  payment-service/     Stripe and payment domain
  order-service/       Checkout orchestration and order lifecycle
libs/
  auth/                Shared auth module, guards, decorators, strategies, auth service
  db/                  Shared TypeORM datasource factory
  contracts/           Shared interfaces and service contracts
  common-bootstrap/    Shared Nest bootstrap helpers
  common-config/       Shared service URL/port/config helpers
  shared/              Shared common entities, utils, payment client, and error handlers
```

## Service Ownership

- `auth-service`: auth runtime and auth APIs (`register`, `login`, `verify/otp`)
- `admin-service`: admin login flow
- `user-service`: user domain service
- `vendor-service`: vendor registration, onboarding, vendor login
- `catalog-service`: products and catalog APIs
- `inventory-service`: inventory and stock APIs, now using `product_id` only
- `payment-service`: Stripe customers, connect accounts, onboarding links, payment boundary
- `order-service`: multi-product checkout orchestration (reserve/confirm/release) and order APIs

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Monorepo Tooling**: [Nx](https://nx.dev/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Database**: PostgreSQL
- **Messaging**: RabbitMQ (events + retries + DLQ)
- **Authentication**: JWT, Passport, service-shared auth library
- **Config**: @nestjs/config
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Linting**: ESLint
- **Containers**: Docker, Docker Compose
- **CI**: GitHub Actions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Docker (optional, for local infrastructure setup)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nest-postgre
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if available) or create `.env` with the following:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=yourpassword
     DB_NAME=learningPostgres
     JWT_ACCESS_SECRET=your-jwt-secret
     JWT_ACCESS_TEMP_SECRET=your-temp-jwt-secret
     JWT_ACCESS_TEMP_EXPIRY=10m
     ACCESS_KEY=your-access-key
     FETCH_COUNTRY_API=https://apiip.net/api/check?ip=
     ```

4. **Set up PostgreSQL database**:
   - Ensure PostgreSQL is running.
   - Create a database named `learningPostgres` or update `DB_NAME` accordingly.

## Shared Libraries

- `libs/auth`
  - shared auth module
  - guards
  - decorators
  - JWT strategies
  - auth service
- `libs/db`
  - shared PostgreSQL datasource factory
  - each service still keeps a tiny local `data-source.ts` that declares its own entities
- `libs/shared`
  - shared entities
  - enums and interfaces
  - shared service clients (`auth`, `catalog`, `inventory`, `payment`)
  - shared RabbitMQ client helper
  - shared request logging interceptor
  - shared error-handler
- `libs/common-config`
  - service URLs and default ports
- `libs/common-bootstrap`
  - bootstrap helpers used by service apps
- `libs/contracts`
  - shared service contracts and health payload types

## Operations Baseline

This repository includes a practical production-readiness starter kit:

- service-local `.env.example` files for each app
- Docker build support via [Dockerfile](/home/shivam/personal/ecommerce/Dockerfile)
- local multi-service infrastructure via [docker-compose.yml](/home/shivam/personal/ecommerce/docker-compose.yml)
- CI validation via [ci.yml](/home/shivam/personal/ecommerce/.github/workflows/ci.yml)
- centralized migration folders under `libs/db/migrations/<service-name>`
- shared health/readiness payloads and startup logging in [index.ts](/home/shivam/personal/ecommerce/libs/common-bootstrap/src/index.ts)
- request-level observability interceptor with request-id + latency logs
- RabbitMQ exchange routing with retry and dead-letter queue support in shared messaging client

## Payment And Order Event Flow

Current checkout/payment orchestration is event-driven:

1. `order-service` creates a pending order and Stripe payment intent.
2. `payment-service` handles Stripe webhooks and stores payment history (`payment_history` table).
3. `payment-service` publishes normalized payment events to RabbitMQ.
4. `order-service` consumes payment events idempotently (`processed_events` table).
5. `order-service` confirms or fails/cancels orders asynchronously.
6. `order-service` uses internal inventory endpoints (token-guarded) to confirm/release reservations without end-user JWT context.

## Nx Workspace

Nx is the workspace runner.

Useful commands:

- `npm run show:projects`
- `npm run graph`
- `npm run build`
- `npm run build:all`
- `npm run start:user`

Direct Nx usage also works:

```bash
NX_DAEMON=false NX_ISOLATE_PLUGINS=false npx nx show projects
NX_DAEMON=false NX_ISOLATE_PLUGINS=false npx nx build user-service
NX_DAEMON=false NX_ISOLATE_PLUGINS=false npx nx serve user-service
```

## Database Setup

This project uses TypeORM and a shared datasource factory in `libs/db`.

## Running Services

Each service is an independent Nest app. Route forwarding should be handled by your external server layer.

```bash
npm run start:auth
npm run start:admin
npm run start:user
npm run start:catalog
npm run start:inventory
npm run start:vendor
npm run start:payment
npm run start:order
```

Default local ports:

- `user-service`: `3002`
- `catalog-service`: `3003`
- `inventory-service`: `3004`
- `vendor-service`: `3005`
- `payment-service`: `3006`
- `admin-service`: `3007`
- `auth-service`: `3008`
- `order-service`: `3009`

Health endpoints exposed by every service:

- `/`
- `/health`
- `/ready`

## Routing

This repo no longer contains a code-level gateway service.

Recommended edge routing ownership:

- `/v1/auth` -> `auth-service`
- `/v1/admin` -> `admin-service`
- `/v1/vendors` -> `vendor-service`
- `/v1/product` -> `catalog-service`
- `/v1/inventory` -> `inventory-service`
- `/v1/payment` -> `payment-service`
- `/v1/orders` -> `order-service`

Your external server or reverse proxy should handle this routing.

## Scripts

- `npm run show:projects` - List all Nx projects
- `npm run graph` - Open the Nx project graph
- `npm run build` - Build all service applications through Nx
- `npm run build:all` - Build all application projects through Nx
- `npm run build:auth` - Build `auth-service`
- `npm run build:admin` - Build `admin-service`
- `npm run build:user` - Build `user-service`
- `npm run build:catalog` - Build `catalog-service`
- `npm run build:inventory` - Build `inventory-service`
- `npm run build:vendor` - Build `vendor-service`
- `npm run build:payment` - Build `payment-service`
- `npm run build:order` - Build `order-service`
- `npm run migration:run:auth` - Run auth-service migrations
- `npm run migration:run:admin` - Run admin-service migrations
- `npm run migration:run:user` - Run user-service migrations
- `npm run migration:run:vendor` - Run vendor-service migrations
- `npm run migration:run:catalog` - Run catalog-service migrations
- `npm run migration:run:inventory` - Run inventory-service migrations
- `npm run migration:run:order` - Run order-service migrations
- `npm run migration:run:payment` - Run payment-service migrations
- `npm run migration:revert:auth` - Revert auth-service migration
- `npm run migration:revert:admin` - Revert admin-service migration
- `npm run migration:revert:user` - Revert user-service migration
- `npm run migration:revert:vendor` - Revert vendor-service migration
- `npm run migration:revert:catalog` - Revert catalog-service migration
- `npm run migration:revert:inventory` - Revert inventory-service migration
- `npm run migration:revert:order` - Revert order-service migration
- `npm run migration:revert:payment` - Revert payment-service migration
- `npm run start:auth` - Start `auth-service`
- `npm run start:admin` - Start `admin-service`
- `npm run start:user` - Start `user-service`
- `npm run start:catalog` - Start `catalog-service`
- `npm run start:inventory` - Start `inventory-service`
- `npm run start:vendor` - Start `vendor-service`
- `npm run start:payment` - Start `payment-service`
- `npm run start:order` - Start `order-service`
- `npm run test` - Run tests
- `npm run lint` - Lint the code

## Docker

Local infrastructure and containerized service runs are scaffolded:

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- Redis
- RabbitMQ (AMQP + management UI)
- `auth-service`
- `admin-service`
- `user-service`
- `vendor-service`
- `catalog-service`
- `inventory-service`
- `payment-service`
- `order-service`

## Current Platform State

- Nx manages builds and service startup.
- Service apps run without a code-level gateway.
- Traffic routing belongs to your external server or reverse proxy.
- CI runs via GitHub Actions.
- Docker and Docker Compose support local multi-service runtime.
- Centralized migration folders and migration commands exist.
- Shared health and readiness endpoints are available across services.
- Shared auth is in `libs/auth`.
- Shared datasource construction is in `libs/db`.
- Shared common and error-handler modules are in `libs/shared`.
- `payment-service` persists webhook payment history.
- `order-service` consumes payment events idempotently and finalizes orders asynchronously.

## Important Notes

- `catalog-service` is the product owner.
- `inventory-service` no longer carries a duplicated `Product` entity and now uses `product_id` directly.
- `inventory-service` also exposes internal reservation confirm/release/reserve routes guarded by `INTERNAL_SERVICE_TOKEN`.
- Extracted services no longer keep duplicate local `common` or `error-handler` folders.
- `auth-service` now exists as a real app, and reusable auth code lives in `libs/auth`.
- Edge routing still needs to be implemented on your actual server or reverse proxy.
- Order and payment migrations now include event/idempotency related tables:
  - `payment_history` in `payment-service`
  - `processed_events` in `order-service`

## Testing

```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.
