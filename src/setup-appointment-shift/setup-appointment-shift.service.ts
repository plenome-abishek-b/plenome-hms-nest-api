import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupAppointmentShift } from './entities/setup-appointment-shift.entity';
@Injectable()
export class SetupAppointmentShiftService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(appointment_shiftEntity: SetupAppointmentShift ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO global_shift (name,start_time,end_time) VALUES (?,?,?)',
      [appointment_shiftEntity.name,
        appointment_shiftEntity.start_time,
        appointment_shiftEntity.end_time
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"global_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupAppointmentShift[]> {
    const global_shift = await this.connection.query('SELECT * FROM global_shift');
    return global_shift ;
  }

  
  async findOne(id: string): Promise<SetupAppointmentShift | null> {
    const global_shift = await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [id]);
    
    if (global_shift.length === 1) {
      return global_shift ;
    } else {
      return null;
    }
  }


  async update(id: string, appointment_shiftEntity: SetupAppointmentShift): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE global_shift SET name =? ,start_time =?, end_time =? WHERE id = ?',
        [appointment_shiftEntity.name,
          appointment_shiftEntity.start_time,
          appointment_shiftEntity.end_time, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"global_shift details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM global_shift WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update global_shift profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM global_shift WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
