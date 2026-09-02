import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { ListServicesUseCase } from "../../application/use-cases/list-services.use-case";
 
@Controller("public/:businessId/services")
export class PublicServiceController {
  constructor(private readonly listServicesUseCase: ListServicesUseCase) {}

@Public()
@Get()
@HttpCode(HttpStatus.OK)
async list(@Param("businessId") businessId: string) {
  const result = await this.listServicesUseCase.execute({ businessId });
  return { success: true, services: result.items.map((s) => s.toPersistence()) };
}
}