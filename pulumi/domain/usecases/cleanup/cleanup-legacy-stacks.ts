import { StackSummary } from "@pulumi/pulumi/automation";
import { getLegacyStacks, LegacyStack } from "./get-legacy-stacks";

export interface StackCleaner {
  destroyStack(stackName: string): Promise<void>;
  removeStack(stackName: string): Promise<void>;
}

export const cleanupLegacyStacks = async (
  stacks: StackSummary[],
  cleaner: StackCleaner,
  cutoffDays: number
) => {
  const legacyStacks = getLegacyStacks(stacks, cutoffDays);
  console.info(
    `Found ${legacyStacks.length} legacy dev stack(s) out of ${stacks.length} total`
  );

  const cleanupStack = async ({ name, requireDestroy }: LegacyStack) => {
    if (requireDestroy) {
      await cleaner.destroyStack(name);
      console.info(`Destroyed legacy stack: ${name}`);
    }

    await cleaner.removeStack(name);
    console.info(`Removed legacy stack: ${name}`);
  };

  await Promise.all(legacyStacks.map(cleanupStack));
  console.info(
    `Removed ${legacyStacks.length} legacy stacks, ${
      stacks.length - legacyStacks.length
    } remaining`
  );
};
