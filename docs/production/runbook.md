# Ops Runbook

## Database Backup

```bash
DB_PASSWORD=... ./scripts/ops/db-backup.sh ./backups
```

## Database Restore

```bash
DB_PASSWORD=... ./scripts/ops/db-restore.sh ./backups/<file>.dump
```

## Replay RabbitMQ DLQ

```bash
RABBITMQ_URL=amqp://localhost:5672 \
DLQ_NAME=order.payment.events.dlq \
REPLAY_ROUTING_KEY=payment.intent.succeeded \
REPLAY_LIMIT=100 \
node scripts/ops/replay-dlq.js
```

## Access-Control Audit

```bash
npm run audit:access-control
```
