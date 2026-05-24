import crypto from "crypto";
import { env } from "../config/env.js";
import { ApiError } from "../utils/errors.js";

function getKey() {
  if (!env.credentialEncryptionKey) {
    throw new ApiError(500, "CREDENTIAL_ENCRYPTION_KEY is not configured");
  }

  return crypto.createHash("sha256").update(env.credentialEncryptionKey).digest();
}

export function encryptSecret(value) {
  if (!value) {
    return "";
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptSecret(value) {
  if (!value) {
    return "";
  }

  const [ivText, tagText, encryptedText] = value.split(".");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivText, "base64"));
  decipher.setAuthTag(Buffer.from(tagText, "base64"));

  return Buffer.concat([decipher.update(Buffer.from(encryptedText, "base64")), decipher.final()]).toString("utf8");
}
