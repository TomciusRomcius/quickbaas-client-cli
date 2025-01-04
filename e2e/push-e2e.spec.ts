import axios from 'axios';
import { execSync } from 'child_process';
import { setupTestEnvs, wipeTestDb } from './setup';

describe('E2E push', () => {
  const cliPath = path.join(__dirname, '..', '..', 'dist', 'main.js');

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

    console.log(fns.data);

    expect(fns.data).toBeDefined();
    const strArr = fns.data as string[];
    expect(strArr.includes('testFunction.js')).toBe(true);
  });
});
