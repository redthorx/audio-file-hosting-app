import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../constants';

export const db = drizzle(DATABASE_URL!);
