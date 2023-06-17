import * as failOnConsole from 'jest-fail-on-console';

failOnConsole({
  shouldFailOnLog: true,
  shouldFailOnInfo: true,
  shouldFailOnDebug: true,
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnAssert: true,
});
