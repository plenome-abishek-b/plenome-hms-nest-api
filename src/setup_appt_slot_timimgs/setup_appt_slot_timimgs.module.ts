import { Module } from '@nestjs/common';
import { SetupApptSlotTimimgsService } from './setup_appt_slot_timimgs.service';
import { SetupApptSlotTimimgsController } from './setup_appt_slot_timimgs.controller';

@Module({
  controllers: [SetupApptSlotTimimgsController],
  providers: [SetupApptSlotTimimgsService],
})
export class SetupApptSlotTimimgsModule {}
