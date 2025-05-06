import {
  BrowserContext,
  Cookie,
  Locator,
  Page,
  expect,
} from "@playwright/test";

export class AuthPage {
  private emailInput: Locator;
  private passwordInput: Locator;
  private continueButton: Locator;

  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext
  ) {
    this.emailInput = page.getByLabel("Email address");
    this.passwordInput = page.getByLabel("Password");
    this.continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  async waitForSession() {
    await expect(this.page).toHaveURL("/");
    await expect
      .poll(
        async () => {
          const cookies = await this.context.cookies();
          return cookies.some(isSessionCookie);
        },
        {
          timeout: 5_000,
        }
      )
      .toBeTruthy();
  }
}

const isSessionCookie = (cookie: Cookie) =>
  cookie.name.match(/auth0.*is\.authenticated/) !== null;
