/**
 * Load .env before any other app code runs.
 * Import this first in server.ts so process.env is set before Firebase config loads.
 */
import dotenv from 'dotenv';

dotenv.config();
