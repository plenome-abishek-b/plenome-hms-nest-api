import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import {SetupHospitalChargesUnitType} from './entities/setup_hospital_charges_unit_type.entity'
@Injectable()
export class unit_typeService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(unit_typeEntity: SetupHospitalChargesUnitType ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO charge_units (unit) VALUES (?)',
      [unit_typeEntity.unit
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_units details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll() {
    const unit_type = await this.connection.query('SELECT * FROM charge_units');
    return unit_type ;
  }

  
  async findOne(id: string) {
    const unit_type = await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [id]);
    
    if (unit_type.length === 1) {
      return unit_type ;
    } else {
      return null;
    }
  }


  async update(id: string, unit_typeEntity: SetupHospitalChargesUnitType): Promise<{ [key: string]: any }[]> {

    try { 
      
      const result = await this.connection.query(
        'UPDATE charge_units SET unit =? WHERE id = ?',
        [unit_typeEntity.unit, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"charge_units details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_units WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charge_units profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_units WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}