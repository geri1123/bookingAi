import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ServiceErrorCode } from "../errors/service-error-codes.enum";

export enum ServicePricingUnit {
  FIXED = "FIXED",
  PER_NIGHT = "PER_NIGHT",
  PER_HOUR = "PER_HOUR",
}
export interface ServiceProps {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  duration: number | null;
  pricingUnit: ServicePricingUnit;
  price: number;
  createdAt: Date;
  updatedAt: Date; 
}
export interface NewServiceProps {
  businessId: string;
  name: string;
  description?: string;
  pricingUnit: ServicePricingUnit;
  duration?: number;
  price: number;
}

const MIN_DURATION_MINUTES = 5;
const MAX_DURATION_MINUTES = 480;

export class ServiceEntity {
  private constructor(private props: ServiceProps) {}

  static create(props: NewServiceProps): ServiceEntity {
    if (!props.name?.trim()) {
      throw new AppException(ServiceErrorCode.INVALID_NAME, { field: "name" }, HttpStatus.BAD_REQUEST);
    }
    if (props.price < 0) {
      throw new AppException(ServiceErrorCode.INVALID_PRICE, { field: "price" }, HttpStatus.BAD_REQUEST);
    }

    const duration = this.validateDuration(props.pricingUnit, props.duration);

  return new ServiceEntity({
  id: randomUUID(),
  businessId: props.businessId,
  name: props.name.trim(),
  description: props.description?.trim() ?? null,
  duration,
  pricingUnit: props.pricingUnit,
  price: props.price,
  createdAt: new Date(),
  updatedAt: new Date(), 
});
  }

  static reconstitute(props: ServiceProps): ServiceEntity {
    return new ServiceEntity(props);
  }

  private static validateDuration(
    pricingUnit: ServicePricingUnit,
    duration: number | undefined,
  ): number | null {
    if (pricingUnit === ServicePricingUnit.FIXED) {
      if (duration === undefined) {
        throw new AppException(
          ServiceErrorCode.DURATION_REQUIRED_FOR_FIXED,
          { field: "duration" },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (duration < MIN_DURATION_MINUTES || duration > MAX_DURATION_MINUTES) {
        throw new AppException(
          ServiceErrorCode.INVALID_DURATION,
          { field: "duration", min: MIN_DURATION_MINUTES, max: MAX_DURATION_MINUTES },
          HttpStatus.BAD_REQUEST,
        );
      }
      return duration;
    }
    return null; // PER_NIGHT / PER_HOUR: e vendos vetë rezervimi
  }

  updateDetails(changes: {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
  }): void {
    if (changes.name !== undefined) {
      if (!changes.name.trim()) {
        throw new AppException(ServiceErrorCode.INVALID_NAME, { field: "name" }, HttpStatus.BAD_REQUEST);
      }
      this.props.name = changes.name.trim();
    }
    if (changes.description !== undefined) {
      this.props.description = changes.description?.trim() ?? null;
    }
    if (changes.price !== undefined) {
      if (changes.price < 0) {
        throw new AppException(ServiceErrorCode.INVALID_PRICE, { field: "price" }, HttpStatus.BAD_REQUEST);
      }
      this.props.price = changes.price;
    }
    if (changes.duration !== undefined) {
      this.props.duration = ServiceEntity.validateDuration(this.props.pricingUnit, changes.duration);
    }
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get duration() { return this.props.duration; }
  get pricingUnit() { return this.props.pricingUnit; }
  get price() { return this.props.price; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt(){return this.props.updatedAt;}
  toPersistence(): ServiceProps {
    return { ...this.props };
  }
}