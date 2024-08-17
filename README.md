# Chat Demo

[![build](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml/badge.svg?query=branch%3Amain)](https://github.com/jbrunton/chat-demo/actions/workflows/build.yml?query=branch%3Amain)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fjbrunton%2Fchat-demo%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/jbrunton/chat-demo/main)
<a href="https://jbrunton.github.io/chat-demo/"><img src="https://img.shields.io/badge/Docs-TypeDoc-blue.svg"/></a>

This project is an exercise in developing good clean architecture and CI/CD practices. It includes (or will include):

* Infrastructure as Code with [Pulumi](https://www.pulumi.com/), including staging and ephemeral dev environments (with automatic dev environment cleanup).
* CI including linting, unit, integration and mutation tests, and automated end to end tests with [Playwright](https://playwright.dev/).
* A clean architecture, including dependency inversion enforced through linting rules with [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries).
* Separate domain, data and application boundaries in the application. Domain logic is completely separated from data access layers using [verified fake implementations](https://github.com/jbrunton/chat-demo/tree/main/services/api/src/data/repositories).
* Continuous deployment pipelines to staging and production environments.
* Automatic documentation of code with [TypeDoc](https://typedoc.org/) deployed using GitHub Pages to [jbrunton.github.io/chat-demo](https://jbrunton.github.io/chat-demo/), and Open API docs deployed along with the api ([chat-demo-api.jbrunton-aws.com/docs](https://chat-demo-api.jbrunton-aws.com/docs)).
* [ ] TODO: Automatic dependency updates (including automerging for minor version changes) with Renovate.

## The demo application

The project implements a very basic realtime chat app at [chat-demo.jbrunton-aws.com](https://chat-demo.jbrunton-aws.com).

* From the home screen you can create "rooms". Each room has a unique URL. Anyone connecting to the room can chat using server-sent events.
* The app responds to commands prefixed with `/`. Type `/help` into the chat window to get assistance.
