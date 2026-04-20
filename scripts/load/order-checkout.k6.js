import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: Number(__ENV.VUS || 10),
  duration: __ENV.DURATION || '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3009';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || '';

export default function () {
  const payload = JSON.stringify({
    items: [{ productId: 1, quantity: 1 }],
  });

  const res = http.post(`${BASE_URL}/v1/orders/checkout`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  check(res, {
    'checkout status is 200 or 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
