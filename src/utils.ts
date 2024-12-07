import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

export function setupEnvs(): void {
  if (process.env.NODE_ENV === 'production') {
    config({ path: ['.env.production', '.env.production.local'] });
  } else if (process.env.NODE_ENV === 'development') {
    config({ path: ['.env.development', '.env.development.local'] });
  } else if (process.env.NODE_ENV === 'testing') {
    config({ path: ['.env.test', '.env.test.local'] });
  }
}
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

export async function readServerFilesInDir(): Promise<ServerFunctionType[]> {
  const dirPath = path.join(process.cwd(), 'functions', 'server-functions');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const fns: ServerFunctionType[] = [];
  for (const file of files) {
    const fileBlob = await fs.readFileSync(path.join(dirPath, file.name));
    if (!file.name.includes('.js')) continue;
    console.log(file.name);
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
