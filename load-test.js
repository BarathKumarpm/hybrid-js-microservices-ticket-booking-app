import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '15s', target: 30 }, // Ramp up to 30 virtual users
    { duration: '30s', target: 100 }, // Stress test with 100 users
    { duration: '15s', target: 0 },   // Cool down
  ],
  thresholds: {
    // We want 95% of requests to stay under 400ms
    http_req_duration: ['p(95)<400'],
    // Ensure less than 1% of requests fail
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Targeting both containers running on your Docker network ports
  const NEST_URL = 'http://localhost:3000/users';
  const BUN_URL = 'http://localhost:3001/tickets';

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // --- PART 1: NESTJS USER SERVICE ---
  const userPayload = JSON.stringify({
    name: 'K6_Nest_Tester',
    email: `nest-${Math.random()}@test.com`,
  });

  const nestRes = http.post(NEST_URL, userPayload, params);

  check(nestRes, {
    'NestJS status is 201': (r) => r.status === 201,
    'NestJS response time ok': (r) => r.timings.duration < 500,
  });

  // --- PART 2: BUN BOOKING SERVICE ---
  const bookingPayload = JSON.stringify({
    eventName: 'Bun High Speed Concert',
    userId: Math.floor(Math.random() * 1000),
    price: 49,
  });

  const bunRes = http.post(BUN_URL, bookingPayload, params);

  check(bunRes, {
    'Bun status is 200': (r) => r.status === 200,
    'Bun response time ok': (r) => r.timings.duration < 500,
  });

  // Short sleep to simulate real user behavior
  sleep(1);
}