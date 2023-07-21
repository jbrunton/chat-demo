import { Locator, Page } from "@playwright/test";

export class RoomPage {
  private messageInput: Locator;
  private sendButton: Locator;
  private messagesList: Locator;
  private joinButton: Locator;

  constructor(private readonly page: Page) {
    this.messageInput = page.getByPlaceholder('Type a message');
    this.sendButton = page.getByRole('button', { name: 'Send' });
    this.messagesList = page.getByRole('list');
    this.joinButton = page.getByRole('button', { name: 'Join' });
  }

  async sendMessage(content: string) {
    await this.messageInput.fill(content);
    await this.sendButton.click();
  }

  async join() {
    await this.joinButton.click();
  }

  getMessage(content: string): Locator {
    return this.messagesList.getByText(content);
  }
}
