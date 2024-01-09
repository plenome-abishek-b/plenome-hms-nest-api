import { Module } from '@nestjs/common';
import { SetupBloodBankProductsService } from './setup-blood_bank-products.service';
import { SetupBloodBankProductsController } from './setup-blood_bank-products.controller';

@Module({
  controllers: [SetupBloodBankProductsController],
  providers: [SetupBloodBankProductsService],
})
export class SetupBloodBankProductsModule {}
