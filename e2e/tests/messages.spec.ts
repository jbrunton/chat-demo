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

test('user can send messages', async ({ page, menu, roomPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.createRoom();

  const message = 'Hello, World!';
  await roomPage.sendMessage(message);
  await expect(roomPage.getMessage(message)).toBeVisible();
});

test("users can join rooms and see each others' messages", async ({
  browser,
  page: user1Page,
  menu: user1Menu,
  roomPage: user1RoomPage
}) => {
  await user1Page.goto('/');

  await user1Menu.open();
  await user1Menu.createRoom();

  const user2Context = await browser.newContext({ storageState: user2AuthFile });
  const user2Page = await user2Context.newPage();

  await user2Page.goto(user1Page.url());

  const user2RoomPage = new RoomPage(user2Page);
  await user2RoomPage.join();

  const message = 'Hi, User 1!';
  await user2RoomPage.sendMessage(message);

  await expect(user1RoomPage.getMessage(message)).toBeVisible();
});
