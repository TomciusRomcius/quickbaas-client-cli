import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';

export function setupTestEnvs(): void {
  config({ path: path.join(__dirname, '..', '..', '.env.test') });
}

export async function wipeTestDb(): Promise<void> {
  await axios.post(`${process.env.BACKEND_URL}/wipe-test-db`, {
    adminKey: 'test',
  });
}
