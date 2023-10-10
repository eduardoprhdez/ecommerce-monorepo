import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import localstackTeardown from './test-teardown';

export const findDockerComposePath = (): string => {
  const currentDir = __dirname;
  const rootDir = path.resolve(currentDir, '../');

  const dockerComposeFilename = 'docker-compose-test.yml';
  let currentPath = currentDir;

  while (currentPath !== rootDir) {
    const filePath = path.join(currentPath, dockerComposeFilename);

    if (fs.existsSync(filePath)) {
      return filePath;
    }

    currentPath = path.dirname(currentPath);
  }

  throw new Error('Docker Compose file not found');
};

async function startDocker(): Promise<void> {
  const dockerComposePath = findDockerComposePath();
  const dockerComposeDir = path.dirname(dockerComposePath);

  console.log('Starting Postgres container...');
  execSync('docker-compose -f docker-compose-test.yml up -d', {
    cwd: dockerComposeDir,
    stdio: 'inherit',
  });
}

export default async (): Promise<void> => {
  try {
    await startDocker();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Error during test setup:', error);
    await localstackTeardown();
  }
};
