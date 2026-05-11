import cors from 'cors';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';

/**
 * Mock IAM HTTP API (Firebase Cloud Functions). Same paths the Angular client uses in production
 * (Firebase Hosting rewrite `/api/**` → this function).
 */
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/api/v1/iam/sign-in', (req, res) => {
  const username = String((req.body as { username?: string })?.username ?? '').trim();
  if (!username) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }
  res.status(200).json({
    username,
    loggedInAt: Date.now(),
  });
});

export const api = onRequest(
  {
    region: 'us-central1',
    invoker: 'public',
  },
  app,
);
