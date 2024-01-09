import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupAppointmentDoctorShiftService } from './setup-appointment-doctor_shift.service';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
@Controller('setup-appointment-doctor-shift')
export class SetupAppointmentDoctorShiftController {
  constructor(private readonly setupAppointmentDoctorShiftService: SetupAppointmentDoctorShiftService) {}

  // @Post()
  // create(@Body() doctor_shiftEntity: SetupAppointmentDoctorShift) {
  //   return this.setupAppointmentDoctorShiftService.create(doctor_shiftEntity);
  // }

  @Get()
  findAll() {
    return this.setupAppointmentDoctorShiftService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() appointment_doctor_shiftEntity: SetupAppointmentDoctorShift) {
    console.log(appointment_doctor_shiftEntity,"qqqqqqqqqqqqq");
    
    return this.setupAppointmentDoctorShiftService.update(id,appointment_doctor_shiftEntity );
  }


}
