import { test as base, expect } from '@playwright/test';
import { Menu } from './fixtures/menu';
import { RoomPage } from './fixtures/room-page';

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

test('user can create rooms', async ({ page, menu }) => {
  await page.goto('/');

  await menu.open();
  await menu.createRoom();

  await expect(page.getByText('Be the first person to say something')).toBeVisible();
});

test('owner can rename rooms', async ({ page, menu, roomPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.createRoom();

  await roomPage.sendMessage('/rename room My Room');

  await expect(roomPage.getMessage('Room renamed to My Room')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My Room' })).toBeVisible();
});
