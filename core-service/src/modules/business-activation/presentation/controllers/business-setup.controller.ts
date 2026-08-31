import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { BusinessContextGuard, CurrentUser, JwtPayload } from "@bookingai/auth";
import { GetBusinessStatusUseCase } from "../../../business/application/use-cases/get-business-status.use-case";


@Controller("business")
export class BusinessSetupController {
  constructor(private readonly getBusinessStatusUseCase: GetBusinessStatusUseCase) {}

  @UseGuards(BusinessContextGuard)
 @Get("setup-status")
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: JwtPayload) {
    const result = await this.getBusinessStatusUseCase.execute(user.businessId!);
    return {
      success: true,
      businessId: result.businessId,
      status: result.status,
      type: result.type,
      completedSteps: result.completedSteps,
    };
  }
}