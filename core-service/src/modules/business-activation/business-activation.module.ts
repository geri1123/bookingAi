import { Module } from "@nestjs/common";
import { BusinessActivationChecker } from "./application/business-activation-checker.service";
import { BusinessSetupReminderService } from "./application/business-setup-reminder.service";
import { BusinessActivationConsumer } from "./infrastructure/business-activation.consumer";
import { BusinessModule } from "../business/bussines.module";
import { UsersModule } from "../users/users.module";
import { ServicesModule } from "../services/services.module";
import { EmployeesModule } from "../employees/employee.module";
import { SchedulesModule } from "../schedules/schedules.module";
import { ResourcesModule } from "../resources/resources.module";
import { BusinessSetupReminderCheckConsumer } from "./infrastructure/business-setup-reminder-check.consumer";
 

@Module({
  imports: [BusinessModule, UsersModule, ServicesModule, EmployeesModule, SchedulesModule, ResourcesModule],
providers: [
  BusinessActivationChecker,
  BusinessSetupReminderService,
  BusinessActivationConsumer,
  BusinessSetupReminderCheckConsumer, 
],
})
export class BusinessActivationModule {}
 