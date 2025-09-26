import { test } from '@playwright/test';
import { execSync } from 'child_process';

async function resetDocker() {
  try {
    console.log('⏳ Restarting Docker containers...');
    execSync(
      'docker restart temporal-dev && docker rm -f nats && docker run -d --name nats --restart=on-failure -p 4222:4222 --expose 4222 nats:2.11.1-binary -js -p 4222 -user user -pass pass',
      { stdio: 'inherit' }
    );
    console.log('✅ Docker containers are up.');
  } catch (error) {
    throw new Error(`Docker reset failed: ${error.message}`);
  }
}

async function resetArango() {
  const collections = ['task', 'task_master'];
  const dbName = 'test';
  const username = 'root';
  const password = 'root';
  const arangoBaseUrl = `http://127.0.0.1:8529/_db/${dbName}/_api/collection`;

  console.log('⏳ Truncating ArangoDB collections...');
  for (const collection of collections) {
    const response = await fetch(`${arangoBaseUrl}/${collection}/truncate`, {
      method: 'PUT',
      headers: {
        Authorization:
          'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to truncate collection "${collection}": ${response.status} ${errorText}`
      );
    }

    console.log(`✅ Collection "${collection}" truncated successfully.`);
  }
}

test('Reset environment', async ({ page }) => {
  try {
    await resetDocker();
    await resetArango();
  } catch (error) {
    console.error('❌ Environment reset failed:', error.message);
  }

  await page.goto('http://google.com');
});

test('Reset Docker', async ({ page }) => {
  try {
    await resetDocker();
  } catch (error) {
    console.error('❌ Docker reset failed:', error.message);
  }

  await page.goto('http://google.com');
});

test('Reset Arango', async ({ page }) => {
  try {
    await resetArango();
  } catch (error) {
    console.error('❌ Arango reset failed:', error.message);
  }

  await page.goto('http://google.com');
});
