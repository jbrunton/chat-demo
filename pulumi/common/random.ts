import * as crypto from "crypto";

export const randomString = (bytes: number) =>
  crypto.randomBytes(bytes).toString("hex");
