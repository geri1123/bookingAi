import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { CustomerErrorCode } from "../errors/customer-error-codes.enum";

export interface CustomerProps {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewCustomerProps {
  businessId: string;
  name: string;
  phone: string;
  email?: string;
}

const MIN_NAME_LENGTH = 2;
// numer telefoni: lejo + opsional ne fillim, pastaj 6-15 shifra (E.164 i thjeshtuar)
const PHONE_REGEX = /^\+?[0-9]{6,15}$/;

export class CustomerEntity {
  private constructor(private props: CustomerProps) {}

  static create(props: NewCustomerProps): CustomerEntity {
    if (!props.name?.trim() || props.name.trim().length < MIN_NAME_LENGTH) {
      throw new AppException(
        CustomerErrorCode.INVALID_NAME,
        { field: "name", min: MIN_NAME_LENGTH },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!props.phone?.trim() || !PHONE_REGEX.test(props.phone.trim())) {
      throw new AppException(CustomerErrorCode.INVALID_PHONE, { field: "phone" }, HttpStatus.BAD_REQUEST);
    }

    const now = new Date();

    return new CustomerEntity({
      id: randomUUID(),
      businessId: props.businessId,
      name: props.name.trim(),
      phone: props.phone.trim(),
      email: props.email?.trim() ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: CustomerProps): CustomerEntity {
    return new CustomerEntity(props);
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get name() { return this.props.name; }
  get phone() { return this.props.phone; }
  get email() { return this.props.email; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toPersistence(): CustomerProps {
    return { ...this.props };
  }
}
