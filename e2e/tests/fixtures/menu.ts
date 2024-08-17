import { Locator, Page } from "@playwright/test";

export class Menu {
  private openMenuButton: Locator;
  private createRoomButton: Locator;
  private signInButton: Locator;

  constructor(private readonly page: Page) {
    this.openMenuButton = page.getByLabel("Open Menu");
    this.createRoomButton = page.getByText("New Room");
    this.signInButton = page.getByText("Sign In");
  }

  async open() {
    await this.openMenuButton.click();
  }

  async signIn() {
    await this.signInButton.click();
  }

  async createRoom() {
    await this.createRoomButton.click();
    await this.page
      .getByText("Be the first person to say something")
      .waitFor({ state: "visible" });
  }
}
