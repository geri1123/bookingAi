import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard } from "@bookingai/auth";
import { SendInvitationDto } from "../dto/send-invitation.dto";
import { SendInvitationUseCase } from "../../application/use-cases/send-invitation.use-case";

@Controller("invitations")
export class InvitationsController {
  constructor(private readonly sendInvitationUseCase: SendInvitationUseCase) {}

  @Roles("OWNER", "MANAGER")
  @UseGuards(BusinessContextGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async send(@Body() dto: SendInvitationDto, @CurrentUser() user: JwtPayload) {
    if (!user.businessId) {
      throw new Error("businessId mungon nga tokeni");
    }

    const result = await this.sendInvitationUseCase.execute({
      businessId: user.businessId,
      invitedBy: user.sub,
      email: dto.email,
      role: dto.role,
    });

    return { success: true, invitationId: result.invitationId };
  }
}