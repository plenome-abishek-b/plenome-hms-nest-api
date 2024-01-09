import { Module } from '@nestjs/common';
import { SetupPharmacyMedicineDosageService } from './setup_pharmacy_medicine_dosage.service';
import { SetupPharmacyMedicineDosageController } from './setup_pharmacy_medicine_dosage.controller';

@Module({
  controllers: [SetupPharmacyMedicineDosageController],
  providers: [SetupPharmacyMedicineDosageService],
})
export class SetupPharmacyMedicineDosageModule {}
