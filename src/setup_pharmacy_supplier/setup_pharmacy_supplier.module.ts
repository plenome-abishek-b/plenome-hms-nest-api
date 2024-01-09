import { Module } from '@nestjs/common';
import { SetupPharmacySupplierService } from './setup_pharmacy_supplier.service';
import { SetupPharmacySupplierController } from './setup_pharmacy_supplier.controller';

@Module({
  controllers: [SetupPharmacySupplierController],
  providers: [SetupPharmacySupplierService],
})
export class SetupPharmacySupplierModule {}
