import { Module } from '@nestjs/common';
import { SetupFinanceExpenseHeadService } from './setup-finance-expense_head.service';
import { SetupFinanceExpenseHeadController } from './setup-finance-expense_head.controller';

@Module({
  controllers: [SetupFinanceExpenseHeadController],
  providers: [SetupFinanceExpenseHeadService],
})
export class SetupFinanceExpenseHeadModule {}
