import { test as base } from '@playwright/test';
import { user1AuthFile, user2AuthFile } from './config';
import { Menu } from './fixtures/menu';
import { AuthPage } from './fixtures/auth';

const setup = base.extend<{ menu: Menu, authPage: AuthPage }>({
  async menu({ page }, use) {
    const menu = new Menu(page);
    await use(menu);
  },

  async authPage({ page, context }, use) {
    const authPage = new AuthPage(page, context);
    await use(authPage);
  },
});

setup('User 1 Auth', async ({ page, menu, authPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.signIn();

  await authPage.signIn(requireEnv('USER1_EMAIL'), requireEnv('USER1_PASSWORD'));
  await authPage.waitForSession();

  await page.context().storageState({ path: user1AuthFile });
});

setup('User 2 Auth', async ({ page, menu, authPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.signIn();

  await authPage.signIn(requireEnv('USER2_EMAIL'), requireEnv('USER2_PASSWORD'));
  await authPage.waitForSession();

  await page.context().storageState({ path: user2AuthFile });
});

const requireEnv = (envName: string) => {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`${envName} was not set`);
  }
  return value;
}
