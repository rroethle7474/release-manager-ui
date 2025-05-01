/**
 * Application configuration
 * Values can be overridden by environment variables
 */

interface Config {
  api: {
    baseUrl: string;
  };
}

const config: Config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7092/api',
  },
};

export default config;
