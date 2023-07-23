import { test as base, expect } from '@playwright/test';
import { Menu } from './fixtures/menu';
import { RoomPage } from './fixtures/room-page';
import { user2AuthFile } from './config';

const test = base.extend<{ menu: Menu, roomPage: RoomPage }>({
  async menu({ page }, use) {
    const menu = new Menu(page);
    await use(menu);
  },

  async roomPage({ page }, use) {
    const roomPage = new RoomPage(page);
    await use(roomPage);
  }
})

test('users can rename themselves', async ({ page, menu, roomPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.createRoom();

  await roomPage.sendMessage('/rename user Joe Bloggs');
  await expect(roomPage.getMessage('User Test User 1 renamed to Joe Bloggs')).toBeVisible();

  await roomPage.sendMessage('/rename user Test User 1');
  await expect(roomPage.getMessage('User Joe Bloggs renamed to Test User 1')).toBeVisible();
});
