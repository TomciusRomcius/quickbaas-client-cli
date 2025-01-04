import axios, { AxiosError } from 'axios';
import {
  adminKey,
  backendURL,
  readServerFilesInDir,
  ServerFunctionType,
} from 'src/utils';

export async function push(): Promise<void> {
  const fns: ServerFunctionType[] = await readServerFilesInDir();
  try {
    await axios.post(`${backendURL}/server-functions/create`, {
      functions: fns,
      adminKey: adminKey,
    });
    console.log('Success');
  } catch (err) {
    const error = err as AxiosError;
    console.log(error?.message);
  }
}
