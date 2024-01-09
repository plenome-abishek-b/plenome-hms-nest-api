import { Module } from '@nestjs/common';
import { SetupPharmacyDoseDurationService } from './setup_pharmacy_dose_duration.service';
import { SetupPharmacyDoseDurationController } from './setup_pharmacy_dose_duration.controller';

@Module({
  controllers: [SetupPharmacyDoseDurationController],
  providers: [SetupPharmacyDoseDurationService],
})
export class SetupPharmacyDoseDurationModule {}
