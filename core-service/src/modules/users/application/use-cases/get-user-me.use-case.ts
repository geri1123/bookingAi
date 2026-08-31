import { Injectable, NotFoundException } from "@nestjs/common";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { UserMapper } from "../../infrastructure/persistence/mappers/user.mapper";

@Injectable()
export class GetUserMeUseCase {
  constructor(
    private readonly userFindRepository: UserFindRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userFindRepository.findById(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      success: true,
      user: UserMapper.toResponse(user),
    };
  }
}