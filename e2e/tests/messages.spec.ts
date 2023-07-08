import { test as base } from '@playwright/test';
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

test('user can send messages', async ( { page, menu, roomPage }) => {
  await page.goto('/');

  await menu.open();
  await menu.createRoom();

  await roomPage.sendMessage('test message');
  await roomPage.getMessage('test message').isVisible();
});
