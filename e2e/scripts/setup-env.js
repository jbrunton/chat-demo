const fs = require("fs");

const setupEnvFile = () => {
  const user1Password = process.env.AUTH0_TEST_USER1_PASSWORD;
  const user2Password = process.env.AUTH0_TEST_USER2_PASSWORD;

  if (!user1Password || !user2Password) {
    throw new Error(
      "Script requires AUTH0_TEST_USER1_PASSWORD and AUTH0_TEST_USER2_PASSWORD env vars"
    );
  }

  const content = [
    "USER1_EMAIL=test.user.1@example.com",
    `USER1_PASSWORD=${user1Password}`,
    "USER2_EMAIL=test.user.2@example.com",
    `USER2_PASSWORD=${user2Password}`,
    "",
  ].join("\n");

  fs.writeFileSync(".env", content, { encoding: "utf8" });

  console.info(".env file created for e2e tests");
};

setupEnvFile();
