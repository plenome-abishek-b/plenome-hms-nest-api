import { Module } from '@nestjs/common';
import {  tax_categoryservice } from './setup_hospital_charges_tax_category.service';
import { SetupHospitalChargesTaxCategoryController } from './setup_hospital_charges_tax_category.controller';

@Module({
  controllers: [SetupHospitalChargesTaxCategoryController],
  providers: [tax_categoryservice],
})
export class SetupHospitalChargesTaxCategoryModule {}
