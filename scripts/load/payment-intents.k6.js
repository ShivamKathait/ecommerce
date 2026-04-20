import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 20),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3006';
const INTERNAL_TOKEN = __ENV.INTERNAL_SERVICE_TOKEN || '';

export default function () {
  const orderId = Math.floor(Math.random() * 100000) + 1;
  const userId = Math.floor(Math.random() * 100000) + 1;

  const payload = JSON.stringify({
    amount: 5000,
    currency: 'INR',
    orderId,
    userId,
  });

  const res = http.post(`${BASE_URL}/v1/payment/intents`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'x-internal-token': INTERNAL_TOKEN,
      'idempotency-key': `load-${orderId}-${userId}`,
    },
  });

  check(res, {
    'intent status is 200 or 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(0.2);
}
