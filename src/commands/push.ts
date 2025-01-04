import axios, { AxiosError } from 'axios';
import {
  adminKey,
  backendURL,
  readMiddlewareFilesInDir,
  readServerFilesInDir,
  ServerFunctionType,
  ServerMiddlewareType,
} from '../utils';

export async function push(): Promise<void> {
  const fns: ServerFunctionType[] = await readServerFilesInDir();
  const middleware: ServerMiddlewareType[] = await readMiddlewareFilesInDir();
  try {
    await axios.post(`${backendURL}/server-functions/create`, {
      functions: fns,
      adminKey: adminKey,
    });

    await axios.post(`${backendURL}/server-middleware/create`, {
      middlewares: middleware,
      adminKey: adminKey,
    });

    console.log('Success');
  } catch (err) {
    const error = err as AxiosError;
    console.log(error?.message);
  }
}
