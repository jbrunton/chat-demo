import { StackSummary } from "@pulumi/pulumi/automation";
import { getEnvironment } from "@usecases/application/get-application-config";
import { subDays } from "date-fns";

export type LegacyStack = {
  name: string;
  requireDestroy: boolean;
};

export const getLegacyStacks = (
  stacks: StackSummary[],
  cutoffDays: number
): LegacyStack[] => {
  return stacks.filter(isLegacy(cutoffDays)).map(({ name, resourceCount }) => ({
    name,
    requireDestroy: !!resourceCount,
  }));
};

const isLegacy = (cutoffDays: number) => (stack: StackSummary) => {
  if (getEnvironment(stack.name) === "production") {
    return false;
  }

  const cutoff = subDays(new Date(), cutoffDays);
  return stack.lastUpdate && new Date(stack.lastUpdate) < cutoff;
};
