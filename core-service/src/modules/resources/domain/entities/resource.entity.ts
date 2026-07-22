import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ResourceErrorCode } from "../errors/resource-error-codes.enum";

// vlerat perputhen SAKTE me enum ResourceType te schema.prisma
export enum ResourceType {
  TABLE = "TABLE",
  ROOM = "ROOM",
  CHAIR = "CHAIR",
  OTHER = "OTHER",
}

export interface ResourceProps {
  id: string;
  businessId: string;
  name: string;
  type: ResourceType;
  capacity: number;
}

export interface NewResourceProps {
  businessId: string;
  name: string;
  type: ResourceType;
  capacity: number;
}

const MIN_NAME_LENGTH = 1;

export class ResourceEntity {
  private constructor(private props: ResourceProps) {}

  static create(props: NewResourceProps): ResourceEntity {
    if (!props.name?.trim() || props.name.trim().length < MIN_NAME_LENGTH) {
      throw new AppException(ResourceErrorCode.INVALID_NAME, { field: "name" }, HttpStatus.BAD_REQUEST);
    }

    if (!Number.isInteger(props.capacity) || props.capacity < 1) {
      throw new AppException(ResourceErrorCode.INVALID_CAPACITY, { field: "capacity", min: 1 }, HttpStatus.BAD_REQUEST);
    }

    return new ResourceEntity({
      id: randomUUID(),
      businessId: props.businessId,
      name: props.name.trim(),
      type: props.type,
      capacity: props.capacity,
    });
  }

  static reconstitute(props: ResourceProps): ResourceEntity {
    return new ResourceEntity(props);
  }

  updateDetails(changes: { name?: string; capacity?: number; type?: ResourceType }): void {
    if (changes.name !== undefined) {
      if (!changes.name.trim()) {
        throw new AppException(ResourceErrorCode.INVALID_NAME, { field: "name" }, HttpStatus.BAD_REQUEST);
      }
      this.props.name = changes.name.trim();
    }
    if (changes.capacity !== undefined) {
      if (!Number.isInteger(changes.capacity) || changes.capacity < 1) {
        throw new AppException(
          ResourceErrorCode.INVALID_CAPACITY,
          { field: "capacity", min: 1 },
          HttpStatus.BAD_REQUEST,
        );
      }
      this.props.capacity = changes.capacity;
    }
    if (changes.type !== undefined) {
      this.props.type = changes.type;
    }
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get name() { return this.props.name; }
  get type() { return this.props.type; }
  get capacity() { return this.props.capacity; }

  toPersistence(): ResourceProps {
    return { ...this.props };
  }
}
