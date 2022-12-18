import { LocalWorkspace } from "@pulumi/pulumi/automation";
import * as usecases from "@usecases";

const workDir = ".";

export const cleanupLegacyStacks = async (cutoffDays: number) => {
  const workspace = await LocalWorkspace.create({ workDir });
  const stacks = await workspace.listStacks();
  const cleaner = new StackCleaner(workspace);
  await usecases.cleanupLegacyStacks(stacks, cleaner, cutoffDays);
};

class StackCleaner implements usecases.StackCleaner {
  private readonly workspace: LocalWorkspace;

  constructor(workspace: LocalWorkspace) {
    this.workspace = workspace;
  }

  async destroyStack(stackName: string): Promise<void> {
    const stack = await LocalWorkspace.selectStack({ stackName, workDir });
    await stack.destroy();
  }

  async removeStack(stackName: string): Promise<void> {
    await this.workspace.removeStack(stackName);
  }
}
