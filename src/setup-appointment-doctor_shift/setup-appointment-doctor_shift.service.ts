import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, DefaultNamingStrategy, createConnection } from 'typeorm';
import { SetupAppointmentDoctorShift } from './entities/setup-appointment-doctor_shift.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupAppointmentDoctorShiftService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(doctor_shiftEntity: SetupAppointmentDoctorShift ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try {
    const result = await this.connection.query(
      'INSERT INTO doctor_global_shift (staff_id,global_shift_id) VALUES (?,?)',
      [
        doctor_shiftEntity.staff_id,
        doctor_shiftEntity.global_shift_id,  
      ]
    );
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
    const AdminCategory = await dynamicConnection.query(`INSERT INTO doctor_global_shift (staff_id,global_shift_id,Hospital_id,hospital_doctor_global_shift_id) VALUES (?,?,?,?)`,[
      doctor_shiftEntity.staff_id,
      doctor_shiftEntity.global_shift_id,
      doctor_shiftEntity.Hospital_id,
      result.insertId

    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"doctor_global_shift details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM doctor_global_shift WHERE id = ?', [result.insertId])
              }}];
  } catch (error) {
    if(dynamicConnection){
    await dynamicConnection.close();
return error
  }}
  }



  async findAll(): Promise<SetupAppointmentDoctorShift[]> {
    const doctor_shift = await this.connection.query(`select * from doctor_global_shift`)
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
  

  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
  const dynamicConnection = await createConnection(dynamicConnectionOptions);

const repo = await dynamicConnection.query(
  'update doctor_global_shift SET global_shift_id = ? Where hospital_doctor_global_shift_id = ? Hospital_id = ?',
[appointment_doctor_shiftEntity.global_shift_id,
id,
appointment_doctor_shiftEntity.Hospital_id
]

  )
  console.log('aaaaaa')
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
