import axios, { AxiosError } from 'axios';
import {
  readDatabaseRules,
  readMiddlewareFilesInDir,
  readServerFilesInDir,
  ServerFunctionType,
  ServerMiddlewareType,
} from '../utils';
import Configuration from '../configuration';

export async function push(): Promise<void> {
  const fns: ServerFunctionType[] = await readServerFilesInDir();
  const middleware: ServerMiddlewareType[] = await readMiddlewareFilesInDir();
  const databaseRules = await readDatabaseRules();

  try {
    await axios.post(
      `${Configuration.getInstance().backendURL}/server-functions/create`,
      {
        functions: fns,
        adminKey: Configuration.getInstance().adminKey,
      },
    );

    await axios.post(
      `${Configuration.getInstance().backendURL}/server-middleware/create`,
      {
        middlewares: middleware,
        adminKey: Configuration.getInstance().adminKey,
      },
    );

    const rulesJson = JSON.parse(databaseRules);
    await axios.post(
      `${Configuration.getInstance().backendURL}/database-rules/set`,
      {
        rules: rulesJson,
        adminKey: Configuration.getInstance().adminKey,
      },
    );

    console.log('Success');
  } catch (err) {
    const error = err as AxiosError;
    console.log(error?.message);
  }
}
