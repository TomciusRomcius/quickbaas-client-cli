#! /usr/bin/env node

import axios, { AxiosError } from 'axios';
import { Command } from 'commander';
import fs from 'fs';
import { config } from 'dotenv';
import path from 'path';

config({ path: '.env.development' });

const program = new Command();
const backendURL = process.env.BACKEND_URL;
const adminKey = process.env.ADMIN_KEY;

type ServerFunctionType = {
  name: string;
  code: string;
};

async function push(): Promise<void> {
  console.log(process.cwd());
  const dirPath = path.join(process.cwd(), 'functions', 'server-functions');
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const fns: ServerFunctionType[] = [];
  for (const file of files) {
    console.log(path.join(dirPath, file.name));
    const fileBlob = await fs.readFileSync(path.join(dirPath, file.name));
    if (!file.name.includes('.js')) continue;
    fns.push({
      name: file.name,
      code: fileBlob.toString(),
    });
    console.log(fileBlob.toString());
  }
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
