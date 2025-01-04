import { config } from 'dotenv';

export default class Configuration {
  static instance: Configuration;
  readonly backendURL: string;
  readonly adminKey: string;

  constructor() {
    config({ path: ['.env', '.env.local'] });

    if (!process.env.BACKEND_URL) {
      throw new Error('BACKEND_URL is undefined');
    }
    if (!process.env.ADMIN_KEY) {
      throw new Error('ADMIN_KEY is undefined');
    }

    this.backendURL = process.env.BACKEND_URL;
    this.adminKey = process.env.ADMIN_KEY;

    this.backendURL = process.env.BACKEND_URL!;
    this.adminKey = process.env.ADMIN_KEY!;
  }

  static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }

    return Configuration.instance;
  }
}
