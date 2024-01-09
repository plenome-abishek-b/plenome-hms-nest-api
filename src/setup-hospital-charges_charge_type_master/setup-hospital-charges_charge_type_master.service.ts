import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHospitalChargesChargeTypeMaster } from './entities/setup-hospital-charges_charge_type_master.entity';
@Injectable()
export class SetupHospitalChargesChargeTypeMasterService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO charge_type_master (charge_type,is_default,is_active,created_at) VALUES (?,?,?,?)',
      [charge_type_masterEntity.charge_type,
        charge_type_masterEntity.is_default,
        charge_type_masterEntity.is_active,
        charge_type_masterEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_type_master details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHospitalChargesChargeTypeMaster[]> {
    const charge_type_master = await this.connection.query('SELECT * FROM charge_type_master');
    return charge_type_master ;
  }

  
  async findOne(id: string): Promise<SetupHospitalChargesChargeTypeMaster> {
    const charge_type_master = await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [id]);
    
    if (charge_type_master.length === 1) {
      return charge_type_master ;
    } else {
      return null;
    }
  }


  async update(id: string, charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      
      const result = await this.connection.query(
        'UPDATE charge_type_master SET charge_type =?,  is_default =?,  is_active =? WHERE id = ?',
        [charge_type_masterEntity.charge_type,
          charge_type_masterEntity.is_default,
          charge_type_masterEntity.is_active,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"charge_type_master details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_type_master WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charge_type_master profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_type_master WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
