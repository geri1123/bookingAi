// src/modules/business/domain/entities/business.entity.ts
import { randomUUID } from "crypto";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessErrorCode } from "../errors/business-error-codes.enum";
import { HttpStatus } from "@nestjs/common";

export enum BusinessType {
  RESTAURANT = "RESTAURANT",
  DENTIST = "DENTIST",
  CLINIC = "CLINIC",
  HOTEL = "HOTEL",
  SALON = "SALON",
  BARBERSHOP = "BARBERSHOP",
  SPA = "SPA",
  GYM = "GYM",
  BEAUTY_CLINIC = "BEAUTY_CLINIC",
  VETERINARY = "VETERINARY",
  CAR_WASH = "CAR_WASH",
  OTHER = "OTHER",
}

export enum BusinessLanguage {
  AL = "AL",
  EN = "EN",
  IT = "IT",
}

export enum BusinessStatus {
  ACTIVE = "ACTIVE",
  PENDING_SETUP = "PENDING_SETUP",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export interface BusinessProps {
  id: string;
  name: string;
  type: BusinessType;
  phone: string | null;
  email: string | null;
  address: string | null;
  language: BusinessLanguage;
  status: BusinessStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewBusinessProps {
  name: string;
  type: BusinessType;
  language: BusinessLanguage;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

const MIN_NAME_LENGTH = 2;

export class BusinessEntity {
  private constructor(private props: BusinessProps) {}

  static create(props: NewBusinessProps): BusinessEntity {
    BusinessEntity.validateName(props.name);

    const now = new Date();

    return new BusinessEntity({
      id: randomUUID(),
      name: props.name.trim(),
      type: props.type,
      phone: props.phone ?? null,
      email: props.email ?? null,
      address: props.address ?? null,
      language: props.language,
      status: BusinessStatus.PENDING_SETUP,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: BusinessProps): BusinessEntity {
    return new BusinessEntity(props);
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length < MIN_NAME_LENGTH) {
      throw new AppException(
        BusinessErrorCode.INVALID_NAME,
        { field: "name", min: MIN_NAME_LENGTH },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  activate():void{
    if(this.props.status===BusinessStatus.PENDING_SETUP){
      this.props.status=BusinessStatus.ACTIVE;
      this.props.updatedAt=new Date();
    }
  }
  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get type() { return this.props.type; }
  get phone() { return this.props.phone; }
  get email() { return this.props.email; }
  get address() { return this.props.address; }
  get language() { return this.props.language; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  toPersistence(): BusinessProps {
    return { ...this.props };
  }
}