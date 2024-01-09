import { Module } from '@nestjs/common';
import { SetupAppointmentDoctorShiftService } from './setup-appointment-doctor_shift.service';
import { SetupAppointmentDoctorShiftController } from './setup-appointment-doctor_shift.controller';

@Module({
  controllers: [SetupAppointmentDoctorShiftController],
  providers: [SetupAppointmentDoctorShiftService],
})
export class SetupAppointmentDoctorShiftModule {}
