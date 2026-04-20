import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    reserve_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 3000,
      stages: [
        { target: 1000, duration: '30s' },
        { target: 5000, duration: '30s' },
        { target: 10000, duration: '30s' },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3004';
const TOKEN = __ENV.JWT_TOKEN || '';
const PRODUCT_ID = __ENV.PRODUCT_ID || '1';

export default function () {
  const reservationId = `${__VU}-${__ITER}-${Date.now()}`;
  const payload = JSON.stringify({
    quantity: 1,
    reservationId,
  });

  const headers = {
    'Content-Type': 'application/json',
    'Idempotency-Key': reservationId,
  };
  if (TOKEN) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const reserveRes = http.post(
    `${BASE_URL}/v1/inventory/product/${PRODUCT_ID}/reservations`,
    payload,
    { headers },
  );

  check(reserveRes, {
    'reserve status is 200/201': (r) => r.status === 200 || r.status === 201,
  });

  if (reserveRes.status === 200 || reserveRes.status === 201) {
    const confirmRes = http.post(
      `${BASE_URL}/v1/inventory/product/${PRODUCT_ID}/reservations/${reservationId}/confirm`,
      null,
      { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} },
    );
    check(confirmRes, {
      'confirm status is 200/201': (r) => r.status === 200 || r.status === 201,
    });
  }

  sleep(0.05);
}

