import { Injectable } from "@nestjs/common";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/;
const MAX_ATTEMPTS = 20;

@Injectable()
export class GenerateUniqueUsernameService {
  constructor(private readonly userFindRepo: UserFindRepository) {}

 
  async execute(seed: string): Promise<string> {
    const base = this.sanitize(seed);

    if (await this.isFree(base)) return base;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const suffix = String(Math.floor(1000 + Math.random() * 9000)); // 4 shifra
      const candidateBase = base.slice(0, 20 - suffix.length);
      const candidate = `${candidateBase}${suffix}`;

      if (await this.isFree(candidate)) return candidate;
    }

 
    const fallback = `user${Date.now().toString(36)}`.slice(0, 20);
    return fallback;
  }

  private async isFree(username: string): Promise<boolean> {
    if (!USERNAME_REGEX.test(username)) return false;
    return !(await this.userFindRepo.existsByUsername(username));
  }

  private sanitize(seed: string): string {
    const cleaned = seed
      .toLowerCase()
      .replace(/[^a-z0-9_.]/g, "")
      .slice(0, 20);

    if (cleaned.length >= 3) return cleaned;

    return `${cleaned}user`.slice(0, 20);
  }
}