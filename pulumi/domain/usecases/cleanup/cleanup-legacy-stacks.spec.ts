import { StackSummary } from "@pulumi/pulumi/automation";
import { mock, MockProxy } from "jest-mock-extended";
import { cleanupLegacyStacks, StackCleaner } from "./cleanup-legacy-stacks";
import { makeStack } from "./get-legacy-stacks.spec";

describe("cleanupLegacyStacks", () => {
  let cleaner: MockProxy<StackCleaner>;
  let logInfo: jest.SpyInstance<void, Parameters<typeof console["info"]>[0]>;

  beforeEach(() => {
    cleaner = mock<StackCleaner>();
    logInfo = jest.spyOn(console, "info").mockImplementation();
  });

  afterEach(() => {
    logInfo.mockReset();
  });

  it("removes empty stacks", async () => {
    const stacks: StackSummary[] = [
      {
        ...makeStack("empty-stack"),
        resourceCount: 0,
      },
    ];

    await cleanupLegacyStacks(stacks, cleaner, 3);

    expect(cleaner.removeStack).toHaveBeenCalledWith("empty-stack");
    expect(cleaner.destroyStack).not.toHaveBeenCalled();

    expect(logInfo).toHaveBeenCalledWith(
      "Found 1 legacy dev stack(s) out of 1 total"
    );
    expect(logInfo).toHaveBeenCalledWith("Removed legacy stack: empty-stack");
    expect(logInfo).toHaveBeenCalledWith(
      "Removed 1 legacy stacks, 0 remaining"
    );
  });

  it("destroys non-empty stacks", async () => {
    const stacks: StackSummary[] = [
      {
        ...makeStack("non-empty-stack"),
        resourceCount: 1,
      },
    ];

    await cleanupLegacyStacks(stacks, cleaner, 3);

    expect(cleaner.destroyStack).toHaveBeenCalledWith("non-empty-stack");
    expect(cleaner.removeStack).toHaveBeenCalledWith("non-empty-stack");

    expect(logInfo).toHaveBeenCalledWith(
      "Found 1 legacy dev stack(s) out of 1 total"
    );
    expect(logInfo).toHaveBeenCalledWith(
      "Destroyed legacy stack: non-empty-stack"
    );
    expect(logInfo).toHaveBeenCalledWith(
      "Removed legacy stack: non-empty-stack"
    );
    expect(logInfo).toHaveBeenCalledWith(
      "Removed 1 legacy stacks, 0 remaining"
    );
  });
});
