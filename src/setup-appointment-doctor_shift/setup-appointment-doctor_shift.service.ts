import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
@Injectable()
export class SetupAppointmentDoctorShiftService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(doctor_shiftEntity: SetupAppointmentDoctorShift ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO doctor_global_shift (global_shift_id) VALUES (?)',
      [
        doctor_shiftEntity.global_shift_id,  
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"doctor_global_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM doctor_global_shift WHERE id = ?', [result.insertId])
              }}];
  }



  async findAll(): Promise<SetupAppointmentDoctorShift[]> {
    const doctor_shift = await this.connection.query(`SELECT CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,doctor_global_shift.staff_id,doctor_global_shift.global_shift_id from doctor_global_shift join staff ON doctor_global_shift.staff_id = staff.id`);
    return doctor_shift ;
  }

  
  

  async update(id: string, appointment_doctor_shiftEntity: SetupAppointmentDoctorShift): Promise<{ [key: string]: any }[]> {

    try {
      
      console.log(appointment_doctor_shiftEntity.global_shift_id,",,,,,,,,,,,,");
      
      const result = await this.connection.query(
        'UPDATE doctor_global_shift SET global_shift_id =? WHERE id = ?',
        [ appointment_doctor_shiftEntity.global_shift_id,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"doctor_global_shift details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM doctor_global_shift WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update doctor_global_shift profile",
         "error":error
      }
      ]
    }
  }


}
