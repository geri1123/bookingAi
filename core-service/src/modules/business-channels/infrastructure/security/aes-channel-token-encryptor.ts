import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import { ChannelTokenEncryptor } from "../../domain/services/channel-token-encryptor";
import { AppConfigService } from "../../../../config/config.service";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // e rekomanduar per GCM

@Injectable()
export class AesChannelTokenEncryptor implements ChannelTokenEncryptor {
  constructor(private readonly appConfig: AppConfigService) {}

  encrypt(plainToken: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plainToken, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(".");
  }

  decrypt(encryptedToken: string): string {
    const [ivB64, authTagB64, cipherTextB64] = encryptedToken.split(".");
    if (!ivB64 || !authTagB64 || !cipherTextB64) {
      throw new Error("Format i pavlefshem per token-in e enkriptuar.");
    }

    const key = this.getKey();
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(authTagB64, "base64");
    const cipherText = Buffer.from(cipherTextB64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return decrypted.toString("utf8");
  }

  private getKey(): Buffer {
    return Buffer.from(this.appConfig.channelTokenEncryptionKey, "hex");
  }
}
