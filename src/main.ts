#! /usr/bin/env node

import { Command } from 'commander';
import { push } from './commands/push';
import { setupEnvs } from './utils';

setupEnvs();

const program = new Command();

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
