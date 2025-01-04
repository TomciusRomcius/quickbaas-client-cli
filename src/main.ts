#! /usr/bin/env node

import { Command } from 'commander';
import { push } from './commands/push';
import Configuration from './configuration';

type CommandType = {
  name: string;
  action: () => void;
};

class CLIApp {
  private program: Command;
  private commands: CommandType[];

  constructor(commands: CommandType[]) {
    this.program = new Command();
    this.commands = commands;

    // Initial initialization
    Configuration.getInstance();

    this.setupCLI();
  }

  private setupCLI(): void {
    this.program
      .name('quickbaas-cli')
      .description('CLI for interacting with QuickBaas backend');

    this.commands.forEach((command) => {
      this.program.command(command.name).action(async () => {
        await command.action();
      });
    });

    this.program.parse(process.argv);
  }
}

const commands: CommandType[] = [];

commands.push({ name: 'push', action: push });

const app = new CLIApp(commands);
