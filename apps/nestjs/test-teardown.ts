import { execSync } from 'child_process';
import * as path from 'path';
import { findDockerComposePath } from './test-setup';

function stopLocalStack(): void {
  const dockerComposePath = findDockerComposePath();
  const dockerComposeDir = path.dirname(dockerComposePath);

  console.log('Stopping Postgres containers...');
  execSync('docker-compose -f docker-compose-test.yml down', {
    cwd: dockerComposeDir,
  });
}

export default async (): Promise<void> => {
  stopLocalStack();
};
