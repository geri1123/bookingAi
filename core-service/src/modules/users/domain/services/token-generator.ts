// domain/services/token-generator.ts
export abstract class TokenGenerator {
  abstract generate(): string;
}