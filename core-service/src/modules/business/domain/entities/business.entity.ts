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

  // TE REJA
  profileImageUrl: string | null;
  profileImagePublicId: string | null;
  latitude: number | null;
  longitude: number | null;

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

  // TE REJA - opsionale ne krijim
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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

    profileImageUrl: props.profileImageUrl ?? null,
    profileImagePublicId: props.profileImagePublicId ?? null,
    latitude: props.latitude ?? null,
    longitude: props.longitude ?? null,

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
  updateProfileImage(url: string, publicId: string): void {
  this.props.profileImageUrl = url;
  this.props.profileImagePublicId = publicId;
  this.props.updatedAt = new Date();
}

removeProfileImage(): void {
  this.props.profileImageUrl = null;
  this.props.profileImagePublicId = null;
  this.props.updatedAt = new Date();
}

updateLocation(latitude: number, longitude: number): void {
  BusinessEntity.validateCoordinates(latitude, longitude);
  this.props.latitude = latitude;
  this.props.longitude = longitude;
  this.props.updatedAt = new Date();
}

private static validateCoordinates(lat: number, lng: number): void {
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new AppException(
      BusinessErrorCode.INVALID_LOCATION,
      { field: "location" },
      HttpStatus.BAD_REQUEST,
    );
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
get profileImageUrl() { return this.props.profileImageUrl; }
get profileImagePublicId() { return this.props.profileImagePublicId; }
get latitude() { return this.props.latitude; }
get longitude() { return this.props.longitude; }
  toPersistence(): BusinessProps {
    return { ...this.props };
  }
}