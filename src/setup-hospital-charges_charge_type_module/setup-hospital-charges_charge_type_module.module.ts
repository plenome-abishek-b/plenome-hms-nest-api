import { Module } from '@nestjs/common';
import { SetupHospitalChargesChargeTypeModuleService } from './setup-hospital-charges_charge_type_module.service';
import { SetupHospitalChargesChargeTypeModuleController } from './setup-hospital-charges_charge_type_module.controller';

@Module({
  controllers: [SetupHospitalChargesChargeTypeModuleController],
  providers: [SetupHospitalChargesChargeTypeModuleService],
})
export class SetupHospitalChargesChargeTypeModuleModule {}
