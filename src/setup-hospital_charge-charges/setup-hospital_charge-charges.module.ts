import { Module } from '@nestjs/common';
import { SetupHospitalChargeChargesService } from './setup-hospital_charge-charges.service';
import { SetupHospitalChargeChargesController } from './setup-hospital_charge-charges.controller';

@Module({
  controllers: [SetupHospitalChargeChargesController],
  providers: [SetupHospitalChargeChargesService],
})
export class SetupHospitalChargeChargesModule {}
