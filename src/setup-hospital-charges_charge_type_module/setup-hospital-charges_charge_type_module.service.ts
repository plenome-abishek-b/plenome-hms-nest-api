import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHospitalChargesChargeTypeModule } from './entities/setup-hospital-charges_charge_type_module.entity';

@Injectable()
export class SetupHospitalChargesChargeTypeModuleService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(charge_type_moduleEntity: SetupHospitalChargesChargeTypeModule ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO charge_type_module (charge_type_master_id,module_shortcode,created_at) VALUES (?,?,?)',
      [charge_type_moduleEntity.charge_type_master_id,
        charge_type_moduleEntity.module_shortcode,
        charge_type_moduleEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_type_module details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHospitalChargesChargeTypeModuleService[]> {
    const charge_type_module = await this.connection.query('SELECT * FROM charge_type_module');
    return charge_type_module ;
  }

  
  async findOne(id: string): Promise<SetupHospitalChargesChargeTypeModuleService> {
    const charge_type_module = await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [id]);
    
    if (charge_type_module.length === 1) {
      return charge_type_module ;
    } else {
      return null;
    }
  }


  async update(id: string, charge_type_moduleEntity: SetupHospitalChargesChargeTypeModule ): Promise<{ [key: string]: any }[]> {

    try {
      console.log(id,charge_type_moduleEntity,"updating data");
      
      
      
      const result = await this.connection.query(
        'UPDATE charge_type_module SET charge_type_master_id =?,  module_shortcode =?  WHERE id = ?',
        [charge_type_moduleEntity.charge_type_master_id,
          charge_type_moduleEntity.module_shortcode,
         id
        ]
      );
  console.log("kkkkkkkk");
  console.log(result,"res");
  
  
      return  [{"data ":{
      status:"success",
      "messege":"charge_type_module details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [id])
      }}];
    } catch (error) {
      console.log(error,"ee");
      
      return [
        {status:"failed",
         "messege":"cannot update charge_type_module profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charge_type_module WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
