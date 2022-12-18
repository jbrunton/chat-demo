import { cleanupLegacyStacks } from "@app/cleanup/cleanup-legacy-stacks";

const cutoffDays = parseInt(process.env.CUTOFF_DAYS || "1", 10);
console.info(`Cleaning up legacy stacks older than ${cutoffDays} days`);

cleanupLegacyStacks(cutoffDays).catch((e) => {
  console.error(e);
  process.exit(1);
});
