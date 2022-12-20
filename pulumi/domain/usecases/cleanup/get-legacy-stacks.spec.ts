import { subDays, subMonths } from "date-fns";
import { getLegacyStacks } from "./get-legacy-stacks";

const now = new Date("2022-02-02T21:22:23.234Z");
const lastMonth = subMonths(now, 1);
const yesterday = subDays(now, 1);

export const makeStack = (name: string) => ({
  name,
  resourceCount: 3,
  lastUpdate: lastMonth.toISOString(),
  current: false,
  updateInProgress: false,
});

describe("getLegacyStacks", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);
  });

  const production = makeStack("production");
  const staging = makeStack("staging");
  const legacyDev = makeStack("legacy-dev");

  it("only returns dev stacks", () => {
    expect(getLegacyStacks([production, staging, legacyDev], 3)).toEqual([
      { name: "staging", requireDestroy: true },
      { name: "legacy-dev", requireDestroy: true },
    ]);
  });

  it("filters out recent dev stacks", () => {
    const recentDev = {
      ...makeStack("recent-dev"),
      lastUpdate: yesterday.toISOString(),
    };
    expect(getLegacyStacks([legacyDev, recentDev], 3)).toEqual([
      { name: "legacy-dev", requireDestroy: true },
    ]);
  });

  it("doesn't require destroy for empty stacks", () => {
    const emptyDev = {
      ...makeStack("empty-dev"),
      resourceCount: 0,
    };
    expect(getLegacyStacks([legacyDev, emptyDev], 3)).toEqual([
      { name: "legacy-dev", requireDestroy: true },
      { name: "empty-dev", requireDestroy: false },
    ]);
  });
});
