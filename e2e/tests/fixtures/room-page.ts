import { Locator, Page, expect } from "@playwright/test";

export class RoomPage {
  private messageInput: Locator;
  private sendButton: Locator;
  private messagesList: Locator;
  private joinButton: Locator;
  private requestButton: Locator;

  constructor(private readonly page: Page) {
    this.messageInput = page.getByPlaceholder("Type a message");
    this.sendButton = page.getByRole("button", { name: "Send" });
    this.messagesList = page.getByRole("list");
    this.joinButton = page.getByRole("button", { name: "Join" });
    this.requestButton = page.getByRole("button", { name: "Request to Join" });
  }

  async sendMessage(content: string) {
    await this.messageInput.fill(content);
    await this.sendButton.click();
  }

  async setJoinPolicy(joinPolicy: string) {
    await this.sendMessage(`/set room join policy ${joinPolicy}`);
    await this.getMessage(`Room join policy updated to ${joinPolicy}`).waitFor({
      state: "visible",
    });
  }

  async join() {
    await this.joinButton.click();
  }

  async requestToJoin() {
    await this.requestButton.click();
  }

  getMessage(content: string): Locator {
    return this.messagesList.getByText(content);
  }
}
