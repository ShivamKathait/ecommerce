# catalog-service

## Purpose
Product catalog domain.

## Main APIs
- `POST /v1/product`
- `PATCH /v1/product/:id`
- `DELETE /v1/product/:id`
- `GET /v1/product/:id`
- `GET /v1/product/list`
- `GET /v1/product/list/my`

## Responsibilities
- Product CRUD with owner/admin authorization.
- Product listing and detail APIs.

## Dependencies
- PostgreSQL (`product` entity)
- Redis/cache-manager for listing cache

## Run
- `npm run start:catalog`
- Default port: `3003`

## Health
- `/`, `/health`, `/ready`
