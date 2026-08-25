import { randomUUID } from "crypto";
import { UserStatus } from "../enums/user-status.enum";
import { PasswordHasher } from "../services/password-hasher";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../errors/user-error-codes.enum";
import { HttpStatus } from "@nestjs/common";

export interface UserProps {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  preferredLocale: string;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface NewUserProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/;
const MIN_PASSWORD_LENGTH = 8;
// Duhet te perputhet SAKTESISHT me `locales` te next-intl (proxy.ts) dhe
// me emrat e skedareve messages/*.json ne frontend - ndrysho te dyja bashke.
const SUPPORTED_LOCALES = ["en", "sq", "it", "de", "es"] as const;

export class UserEntity {
  private constructor(private props: UserProps) {}

  static create(props: NewUserProps): UserEntity {
    UserEntity.validateEmail(props.email);
    UserEntity.validateUsername(props.username);
    UserEntity.validatePassword(props.password);

    const now = new Date();

    return new UserEntity({
      id: randomUUID(),
      username: props.username,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email.toLowerCase().trim(),
      password: props.password,
      status: UserStatus.PENDING_VERIFICATION,
      preferredLocale: "en",
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  static reconstitute(props: UserProps): UserEntity {
    return new UserEntity(props);
  }

  private static validateEmail(email: string): void {
    if (!EMAIL_REGEX.test(email)) {
      throw new AppException(UserErrorCode.INVALID_EMAIL_FORMAT, { field: "email" }, HttpStatus.BAD_REQUEST);
    }
  }

  private static validateUsername(username: string): void {
    if (!USERNAME_REGEX.test(username)) {
      throw new AppException(
        UserErrorCode.INVALID_USERNAME_FORMAT,
        { field: "username", min: 3, max: 20 },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private static validatePassword(password: string): void {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new AppException(
        UserErrorCode.WEAK_PASSWORD,
        { field: "password", min: MIN_PASSWORD_LENGTH },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private static validateLocale(locale: string): void {
    if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
      throw new AppException(
        UserErrorCode.UNSUPPORTED_LOCALE,
        { field: "preferredLocale", allowed: SUPPORTED_LOCALES },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  get id() { return this.props.id; }
  get username() { return this.props.username; }
  get firstName() { return this.props.firstName; }
  get lastName() { return this.props.lastName; }
  get email() { return this.props.email; }
  get status() { return this.props.status; }
  get preferredLocale() { return this.props.preferredLocale; }
  get emailVerifiedAt() { return this.props.emailVerifiedAt; }
  get lastLoginAt() { return this.props.lastLoginAt; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get deletedAt() { return this.props.deletedAt; }

  async verifyPassword(plain: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.compare(plain, this.props.password);
  }

  verifyEmail(): void {
    if (this.props.emailVerifiedAt) return;
    this.props.emailVerifiedAt = new Date();
    this.props.status = UserStatus.ACTIVE;
    this.touch();
  }

  changePassword(hashedPassword: string): void {
    this.props.password = hashedPassword;
    this.touch();
  }
  changeUsername(username: string): void {
  UserEntity.validateUsername(username);
  this.props.username = username;
  this.touch();
}

changeName(firstName: string, lastName: string): void {
  this.props.firstName = firstName;
  this.props.lastName = lastName;
  this.touch();
}
  // I ri - thirret nga PATCH /users/me/locale kur useri ndryshon gjuhen
  // ne dashboard (i loguar). Front-end-i pastaj e rishkruan cookie-n
  // 'locale' NJEKOHESISHT, qe proxy.ts te mos duhet te pyese DB fare.
  changeLocale(locale: string): void {
    UserEntity.validateLocale(locale);
    this.props.preferredLocale = locale;
    this.touch();
  }

  recordLogin(): void {
    this.props.lastLoginAt = new Date();
    this.touch();
  }

  suspend(): void {
    this.props.status = UserStatus.SUSPENDED;
    this.touch();
  }

  softDelete(): void {
    this.props.status = UserStatus.DELETED;
    this.props.deletedAt = new Date();
    this.touch();
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toPersistence(): UserProps {
    return { ...this.props };
  }
}