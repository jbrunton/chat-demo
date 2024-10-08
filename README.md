# Chat Demo

[![build](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml/badge.svg?query=branch%3Amain)](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml?query=branch%3Amain)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fjbrunton%2Fchat-demo%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/jbrunton/chat-demo/main)
<a href="https://jbrunton.github.io/chat-demo/"><img src="https://img.shields.io/badge/Docs-TypeDoc-blue.svg"/></a>

This project is an exercise in developing good clean architecture and CI/CD practices. It includes (or will include):

- Infrastructure as Code with [Pulumi](https://www.pulumi.com/), including staging and ephemeral dev environments (with automatic dev environment cleanup).
- CI including linting, unit, integration and mutation tests, and automated end to end tests with [Playwright](https://playwright.dev/).
- Docker image built using [Cloud Native Buildpacks](https://buildpacks.io/).
- A clean architecture, including dependency inversion enforced through linting rules with [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries).
- Separate domain, data and application boundaries in the application. Domain logic is completely separated from data access layers using [verified fake implementations](https://github.com/jbrunton/chat-demo/tree/main/services/api/src/data/repositories).
- Continuous deployment pipelines to staging and production environments.
- Automatic documentation of code with [TypeDoc](https://typedoc.org/) deployed using GitHub Pages to [jbrunton.github.io/chat-demo](https://jbrunton.github.io/chat-demo/), and Open API docs deployed along with the api ([chat-demo-api.jbrunton-aws.com/docs](https://chat-demo-api.jbrunton-aws.com/docs)).
- Automatic dependency updates (including automerging) with Renovate.

## The demo application

The project implements a very basic realtime chat app at [chat-demo.jbrunton-aws.com](https://chat-demo.jbrunton-aws.com).

- From the home screen or navigation menu you can create "rooms". Each room has a unique URL. Anyone who joins a room can chat using server-sent events.
- The app responds to commands prefixed with `/`. Type `/help` into the chat window to get assistance.

<p align="center">
  <img src="https://github.com/user-attachments/assets/a5700d6f-f1d1-4720-a784-42d6098a4af4" alt="Screenshot of Chat Demo app" />
</p>

## Local dev

Clone the repository, and then:

```console
docker compose up -d
pnpm install
pnpm dev:setup
pnpm dev
```

The web client will then be running locally at http://localhost:5173/.

To configure environment variables for the Playwright e2e tests:

```console
pnpm test:e2e:setup
```
