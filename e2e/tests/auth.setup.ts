import { test as base } from '@playwright/test';
import { authFile } from './config';
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
  }
})

setup('authenticate', async ({ page, menu, authPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.signIn();

  await authPage.signIn(requireEnv('USER_EMAIL'), requireEnv('USER_PASSWORD'));
  await authPage.waitForSession();

  await page.context().storageState({ path: authFile });
});

const requireEnv = (envName: string) => {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`${envName} was not set`);
  }
  return value;
}
