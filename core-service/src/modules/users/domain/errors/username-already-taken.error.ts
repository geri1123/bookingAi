import { DomainError } from "../../../../common/domain/domain.error";

export class UsernameAlreadyTakenError extends DomainError {
  constructor(public readonly username: string) {
    super(`Username ${username} is already taken`);
  }
}