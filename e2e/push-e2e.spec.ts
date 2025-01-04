import axios from 'axios';
import { execSync } from 'child_process';
import { setupTestEnvs, wipeTestDb } from './setup';
import rules from '../database-rules.json';

describe('E2E push', () => {
  beforeAll(async () => {
    setupTestEnvs();
    await wipeTestDb();
  });

  it('should run the command succesfully', () => {
    try {
      execSync(`npx quickbaas push`);
    } catch {
      fail('Returned a non 0 code or timed out');
    }
  });

  it('should succesfully add server functions', async () => {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/server-functions/get`,
      {
        adminKey: process.env.ADMIN_KEY,
      },
    );

    expect(res.data).toBeDefined();
    const strArr = res.data as string[];
    expect(strArr.includes('test-function.js')).toBe(true);
  });

  it('should succesfully add middleware', async () => {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/server-middleware/get`,
      {
        adminKey: process.env.ADMIN_KEY,
      },
    );

    const middlewares = res.data as string[];
    expect(middlewares).toBeTruthy();
    expect(middlewares.includes('database-auth-middleware.js')).toBe(true);
  });

  it('should succesfully add middleware', async () => {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/database-rules/get`,
      {
        adminKey: process.env.ADMIN_KEY,
      },
    );

    expect(res.status).toBe(201);
    expect(JSON.stringify(res.data)).toBe(JSON.stringify(rules));
  });
});
