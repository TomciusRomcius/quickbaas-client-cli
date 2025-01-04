import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// TODO: make these const
export let backendURL = process.env.BACKEND_URL;
export let adminKey = process.env.ADMIN_KEY;

export type ServerFunctionType = {
  name: string;
  code: string;
};

export type ServerMiddlewareType = {
  name: string;
  code: string;
  runsOn: {
    database: boolean;
    auth: boolean;
  };
};

export function setupEnvs(): void {
  config({ path: ['.env', '.env.local'] });
  backendURL = process.env.BACKEND_URL;
  adminKey = process.env.ADMIN_KEY;
}

// TODO: add typescript support
export async function readServerFilesInDir(): Promise<ServerFunctionType[]> {
  const dirPath = path.join(process.cwd(), 'functions', 'server-functions');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const fns: ServerFunctionType[] = [];
  for (const file of files) {
    const fileBlob = await fs.readFileSync(path.join(dirPath, file.name));
    if (!file.name.endsWith('.js')) continue;
    fns.push({
      name: file.name,
      code: fileBlob.toString(),
    });
  }

  return fns;
}

export async function readMiddlewareFilesInDir(): Promise<
  ServerMiddlewareType[]
> {
  const dirPath = path.join(process.cwd(), 'functions', 'server-middleware');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const fns: ServerMiddlewareType[] = [];
  for (const file of files) {
    const fileBlob = await fs.readFileSync(path.join(dirPath, file.name));
    if (!file.name.includes('.js')) continue;

    // TODO: add paths to execute on
    fns.push({
      name: file.name,
      code: fileBlob.toString(),
      runsOn: {
        database: true,
        auth: true,
      },
    });
  }

  return fns;
}
