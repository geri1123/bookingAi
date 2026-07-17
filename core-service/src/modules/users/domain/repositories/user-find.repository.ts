import { UserEntity } from "../entities/user.entity";

export abstract class UserFindRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByUsername(username: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByUsername(username: string): Promise<boolean>;
  abstract findByIdentifier(identifier: string): Promise<UserEntity | null>;
}