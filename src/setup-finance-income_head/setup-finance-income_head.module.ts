import { Module } from '@nestjs/common';
import { SetupFinanceIncomeHeadService } from './setup-finance-income_head.service';
import { SetupFinanceIncomeHeadController } from './setup-finance-income_head.controller';

@Module({
  controllers: [SetupFinanceIncomeHeadController],
  providers: [SetupFinanceIncomeHeadService],
})
export class SetupFinanceIncomeHeadModule {}
