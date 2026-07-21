import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { EmployeeErrorCode } from "../errors/employee-error-codes.enum";

export interface EmployeeProps {
  id: string;
  businessId: string;
  name: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewEmployeeProps {
  businessId: string;
  name: string;
  phone?: string;
}

const MIN_NAME_LENGTH = 2;

export class EmployeeEntity {
  private constructor(private props: EmployeeProps) {}

  static create(props: NewEmployeeProps): EmployeeEntity {
    if (!props.name?.trim() || props.name.trim().length < MIN_NAME_LENGTH) {
      throw new AppException(
        EmployeeErrorCode.INVALID_NAME,
        { field: "name", min: MIN_NAME_LENGTH },
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();

    return new EmployeeEntity({
      id: randomUUID(),
      businessId: props.businessId,
      name: props.name.trim(),
      phone: props.phone?.trim() ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: EmployeeProps): EmployeeEntity {
    return new EmployeeEntity(props);
  }

  updateDetails(changes: { name?: string; phone?: string | null }): void {
    if (changes.name !== undefined) {
      if (!changes.name.trim() || changes.name.trim().length < MIN_NAME_LENGTH) {
        throw new AppException(
          EmployeeErrorCode.INVALID_NAME,
          { field: "name", min: MIN_NAME_LENGTH },
          HttpStatus.BAD_REQUEST,
        );
      }
      this.props.name = changes.name.trim();
    }
    if (changes.phone !== undefined) {
      this.props.phone = changes.phone?.trim() ?? null;
    }
    this.props.updatedAt = new Date();
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get name() { return this.props.name; }
  get phone() { return this.props.phone; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toPersistence(): EmployeeProps {
    return { ...this.props };
  }
}
