import { Module } from '@nestjs/common';
import { SetupHospitalChargesChargeTypeMasterService } from './setup-hospital-charges_charge_type_master.service';
import { SetupHospitalChargesChargeTypeMasterController } from './setup-hospital-charges_charge_type_master.controller';

@Module({
  controllers: [SetupHospitalChargesChargeTypeMasterController],
  providers: [SetupHospitalChargesChargeTypeMasterService],
})
export class SetupHospitalChargesChargeTypeMasterModule {}
