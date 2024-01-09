import { Module } from '@nestjs/common';
import { SetupAppointmentShiftService } from './setup-appointment-shift.service';
import { SetupAppointmentShiftController } from './setup-appointment-shift.controller';

@Module({
  controllers: [SetupAppointmentShiftController],
  providers: [SetupAppointmentShiftService],
})
export class SetupAppointmentShiftModule {}
