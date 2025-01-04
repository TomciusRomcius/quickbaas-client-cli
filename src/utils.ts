import fs from 'fs';
import path from 'path';

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

// TODO: add typescript support
export async function readMiddlewareFilesInDir(): Promise<
  ServerMiddlewareType[]
> {
  const dirPath = path.join(process.cwd(), 'functions', 'server-middleware');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const middlewares: ServerMiddlewareType[] = [];
  for (const file of files) {
    const fileBlob = await fs.readFileSync(path.join(dirPath, file.name));
    if (!file.name.includes('.js')) continue;

    // Definitely not the best way :)
    const runsOnDb = file.name.toLowerCase().includes('database');
    const runsOnAuth = file.name.toLowerCase().includes('auth');

    middlewares.push({
      name: file.name,
      code: fileBlob.toString(),
      runsOn: {
        database: runsOnDb,
        auth: runsOnAuth,
      },
    });
  }
  return middlewares;
}
