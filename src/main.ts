#! /usr/bin/env node

import axios, { AxiosError } from 'axios';
import { Command } from 'commander';
import { config } from 'dotenv';
import { readServerFilesInDir } from './utils';

config({ path: '.env.development' });

const program = new Command();
const backendURL = process.env.BACKEND_URL;
const adminKey = process.env.ADMIN_KEY;

type ServerFunctionType = {
  name: string;
  code: string;
};

async function push(): Promise<void> {
  const fns: ServerFunctionType[] = await readServerFilesInDir();
  try {
    const res = await axios.post(`${backendURL}/server-functions/create`, {
      functions: fns,
      adminKey: adminKey,
    });

    console.log(res.data);
  } catch (err) {
    const error = err as AxiosError;
    console.log(error?.message);
  }
}

function setupCLI(): void {
  program
    .name('quickbaas-cli')
    .description('CLI for interacting with QuickBaas backend');

  program.command('push').action(async () => {
    await push();
  });

  program.parse(process.argv);
}

setupCLI();
