import axios from 'axios';
import { execSync } from 'child_process';
import { setupTestEnvs, wipeTestDb } from './setup';

describe('E2E push', () => {
  beforeAll(async () => {
    setupTestEnvs();
    await wipeTestDb();
  });

  it('should succesfully add server functions', async () => {
    execSync(`npx quickbaas push`);
    const fns = await axios.post(
      `${process.env.BACKEND_URL}/server-functions/get`,
      {
        adminKey: process.env.ADMIN_KEY,
      },
    );

    expect(fns.data).toBeDefined();
    const strArr = fns.data as string[];
    expect(strArr.includes('test-function.js')).toBe(true);
  });

  it('should succesfully add middleware', async () => {
    execSync(`npx quickbaas push`);
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
});
