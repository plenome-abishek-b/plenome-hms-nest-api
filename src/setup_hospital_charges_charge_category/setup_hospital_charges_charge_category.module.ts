import { Module } from '@nestjs/common';
import { SetupHospitalChargesChargeCategoryService } from './setup_hospital_charges_charge_category.service';
import { SetupHospitalChargesChargeCategoryController } from './setup_hospital_charges_charge_category.controller';

@Module({
  controllers: [SetupHospitalChargesChargeCategoryController],
  providers: [SetupHospitalChargesChargeCategoryService],
})
export class SetupHospitalChargesChargeCategoryModule {}
