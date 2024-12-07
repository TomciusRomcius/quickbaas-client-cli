import { config } from 'dotenv';

export function setupEnvs(): void {
  if (process.env.NODE_ENV === 'production') {
    config({ path: ['.env.production', '.env.production.local'] });
  } else if (process.env.NODE_ENV === 'development') {
    config({ path: ['.env.development', '.env.development.local'] });
  } else if (process.env.NODE_ENV === 'testing') {
    config({ path: ['.env.test', '.env.test.local'] });
  }
}
