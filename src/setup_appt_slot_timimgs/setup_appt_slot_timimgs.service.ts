import { Injectable } from '@nestjs/common';
import { SetupApptSlotTimimg } from './entities/setup_appt_slot_timimg.entity';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
@Injectable()
export class SetupApptSlotTimimgsService {
  constructor(@InjectConnection() private connection: Connection) {}

async  create(timingEntity: SetupApptSlotTimimg): Promise<{[key: string]: any}[]> {
  const insert = await this.connection.query(` insert into doctor_shift (day,
    staff_id,
    global_shift_id,
    start_time,
    end_time) values (?,?,?,?,?)`,[
      timingEntity.day,
      timingEntity.staff_id,
      timingEntity.global_shift_id,
      timingEntity.start_time,
      timingEntity.end_time
    ])
    // return "inserted id : "+insert.insertId;
    return [{"data ":{"id  ":insert.insertId,
              "status":"success",
              "messege":"doctor_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM doctor_shift WHERE id = ?', [insert.insertId])
              }}];
  }

async  finforDocAndShift(day:string,staff_id:number,global_shift_id:number) {
  const slot_timings = await this.connection.query(`select doctor_shift.start_time,doctor_shift.end_time ,doctor_shift.day
   from doctor_shift where day = ? and staff_id = ? and global_shift_id = ?`,[
    day,staff_id,global_shift_id
   ])
    return slot_timings;
  }

  findOne(id: number) {
    return `This action returns a #${id} setupApptSlotTimimg`;
  }

async  update(id: number, timingEntity: SetupApptSlotTimimg):Promise<{ [key:string]: any}[]> {
    const update = await this.connection.query('update doctor_shift set start_time = ?, end_time = ? where id = ?',[
      timingEntity.start_time,
      timingEntity.end_time,id
    ])
    // return `This action updates a #${id} setupApptSlotTimimg`;
    return  [{"data ":{
      status:"success",
      "message":"doctor_shift details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM doctor_shift WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update doctor_shift module",
  }
  ]
}
  

async  remove(id: number) {
    const del = await this.connection.query('delete from doctor_shift where id = ?',[id]);
    // return `This action removes a #${id} setupApptSlotTimimg`;

    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
