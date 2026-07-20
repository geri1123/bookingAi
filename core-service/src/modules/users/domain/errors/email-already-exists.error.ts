import { DomainError } from "../../../../common/domain/domain.error";

export class EmailAlreadyExistsError extends DomainError {
  constructor(public readonly email: string) {
    super(`Email ${email} is already in use`);
  }
}