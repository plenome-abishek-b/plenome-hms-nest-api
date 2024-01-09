import { Module } from '@nestjs/common';
import { SetupApptSlotAmountService } from './setup_appt_slot_amount.service';
import { SetupApptSlotAmountController } from './setup_appt_slot_amount.controller';

@Module({
  controllers: [SetupApptSlotAmountController],
  providers: [SetupApptSlotAmountService],
})
export class SetupApptSlotAmountModule {}
