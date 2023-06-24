import { Locator, Page } from "@playwright/test";

export class RoomPage {
  private messageInput: Locator;
  private sendButton: Locator;
  private messagesList: Locator;

  constructor(private readonly page: Page) {
    this.messageInput = page.getByPlaceholder('Type a message');
    this.sendButton = page.getByRole('button', { name: 'Send ' });
    this.messagesList = page.getByRole('list');
  }

  async sendMessage(content: string) {
    await this.messageInput.fill('test message');
    await this.sendButton.click();
  }

  getMessage(content: string): Locator {
    return this.messagesList.getByText(content);
  }
}
