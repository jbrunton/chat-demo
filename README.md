# Chat Demo

[![build](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml/badge.svg?query=branch%3Amain)](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml?query=branch%3Amain)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fjbrunton%2Fchat-demo%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/jbrunton/chat-demo/main)

This project is an exercise in developing good clean architecture and CI/CD practices. It includes (or will include):

* Infrastructure as Code with [Pulumi](https://www.pulumi.com/), including automatic provisioning of preview environments for each PR.
* CI including linting, unit and integration tests.
  * [ ] TODO: Eventually end to end tests with Playwright.
  * [ ] TODO: Add mutation tests for API.
* A clean architecture, including dependency inversion enforced through linting rules with [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries).
* Continuous delivery practices, including automatic deployments to staging and production environments.
* [ ] TODO: Automatic dependency updates (including automerging for minor version changes) with Renovate.

## The demo application

The project implements a very basic realtime chat app at [chat-demo.jbrunton-aws.com](https://chat-demo.jbrunton-aws.com).

* From the home screen you can create "rooms". Each room has a unique URL. Anyone connecting to the room can chat using server-sent events.
* The app responds to commands prefixed with `/`. Type `/help` into the chat window to get assistance.
