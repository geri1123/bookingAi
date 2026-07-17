import { Injectable } from "@nestjs/common";

@Injectable()
export class LogoutUseCase {
  async execute(): Promise<void> {
    // stateless - asnje veprim DB, fshirja e cookies behet nga controller
  }
}