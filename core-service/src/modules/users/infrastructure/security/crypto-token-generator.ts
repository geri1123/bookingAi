import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import { TokenGenerator } from "../../domain/services/token-generator";


@Injectable()
export class CryptoTokenGenerator implements TokenGenerator {
  generate(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}