import { test as base, expect } from "@playwright/test";
import { Menu } from "./fixtures/menu";
import { RoomPage } from "./fixtures/room-page";
import { user2AuthFile } from "./config";

const test = base.extend<{ menu: Menu; roomPage: RoomPage }>({
  async menu({ page }, use) {
    const menu = new Menu(page);
    await use(menu);
  },

  async roomPage({ page }, use) {
    const roomPage = new RoomPage(page);
    await use(roomPage);
  },
});

test("users can create rooms", async ({ page, menu }) => {
  await page.goto("/");

  await menu.open();
  await menu.createRoom();

  await expect(
    page.getByText("Be the first person to say something")
  ).toBeVisible();
});

test("users can join rooms", async ({
  page: user1Page,
  roomPage: user1RoomPage,
  menu: user1Menu,
  browser,
}) => {
  await user1Page.goto("/");

  await user1Menu.open();
  await user1Menu.createRoom();
  await user1RoomPage.setJoinPolicy("anyone");

  const user2Context = await browser.newContext({
    storageState: user2AuthFile,
  });
  const user2Page = await user2Context.newPage();

  await user2Page.goto(user1Page.url());

  const user2RoomPage = new RoomPage(user2Page);
  await user2RoomPage.join();

  await expect(
    user1Page.getByText("Test User 2 joined the room. Welcome!")
  ).toBeVisible();
  await expect(
    user2Page.getByText("Test User 2 joined the room. Welcome!")
  ).toBeVisible();
});

test("owners can rename rooms", async ({ page, menu, roomPage }) => {
  await page.goto("/");

  await menu.open();
  await menu.createRoom();

  await roomPage.sendMessage("/rename room My Room");

  await expect(roomPage.getMessage("Room renamed to My Room")).toBeVisible();
  await expect(page.getByRole("heading", { name: "My Room" })).toBeVisible();
});

test("users can request to join rooms when join policy = 'request'", async ({
  page: user1Page,
  roomPage: user1RoomPage,
  menu: user1Menu,
  browser,
}) => {
  await user1Page.goto("/");

  await user1Menu.open();
  await user1Menu.createRoom();
  await user1RoomPage.setJoinPolicy("request");

  const user2Context = await browser.newContext({
    storageState: user2AuthFile,
  });
  const user2Page = await user2Context.newPage();

  await user2Page.goto(user1Page.url());

  const user2RoomPage = new RoomPage(user2Page);
  await user2RoomPage.requestToJoin();

  await expect(
    user1Page.getByText(
      "Test User 2 (test.user.2@example.com) requested approval to join the room"
    )
  ).toBeVisible();

  await user1RoomPage.sendMessage("/approve request test.user.2@example.com");

  await expect(
    user1Page.getByText("Test User 1 approved Test User 2 to join the room")
  ).toBeVisible();
  await user2Page.reload();
  await expect(
    user2Page.getByText("Test User 1 approved Test User 2 to join the room")
  ).toBeVisible();
});

test("users can send invites to rooms when join policy = 'invite'", async ({
  page: user1Page,
  roomPage: user1RoomPage,
  menu: user1Menu,
  browser,
}) => {
  await user1Page.goto("/");

  await user1Menu.open();
  await user1Menu.createRoom();
  await user1RoomPage.setJoinPolicy("invite");

  const user2Context = await browser.newContext({
    storageState: user2AuthFile,
  });
  const user2Page = await user2Context.newPage();

  await user2Page.goto(user1Page.url());

  const user2RoomPage = new RoomPage(user2Page);
  await expect(user2Page.getByText("You need an invite to join")).toBeVisible();

  await user1RoomPage.sendMessage("/invite test.user.2@example.com");

  await expect(
    user1Page.getByText("Test User 1 invited Test User 2 to join the room")
  ).toBeVisible();

  await user2Page.reload();
  await user2RoomPage.join();

  await expect(
    user1Page.getByText("Test User 2 joined the room")
  ).toBeVisible();
  await expect(
    user2Page.getByText("Test User 2 joined the room")
  ).toBeVisible();
});
