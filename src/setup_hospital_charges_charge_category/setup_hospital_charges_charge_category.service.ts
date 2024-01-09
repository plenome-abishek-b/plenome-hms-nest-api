import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHospitalChargesChargeCategory } from './entities/setup_hospital_charges_charge_category.entity';


@Injectable()
export class SetupHospitalChargesChargeCategoryService {
  
  constructor(@InjectConnection() private connection: Connection) {}



  async create(charge_categoryEntity: SetupHospitalChargesChargeCategory): Promise<{[key: string]: any}[]>{
  const result = await this.connection.query(
  'INSERT INTO charge_categories (charge_type_id,name,description,short_code,is_default) VALUES (?,?,?,?,?)',
 [charge_categoryEntity.charge_type_id,
  charge_categoryEntity.name,
  charge_categoryEntity.description,
  charge_categoryEntity.short_code,
  charge_categoryEntity.is_default

]
  );

  return [{"data":{"id ":result.insertId,
  "status":"success",
  "messege":"charge_category details added successfully inserted",
  "inserted_data": await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [result.insertId])
  }}];
}



async findAll() {
  const charge_category = await this.connection.query(`select charge_categories.id,charge_type_master.charge_type,charge_categories.name,charge_categories.description,charge_categories.short_code,charge_categories.is_default,
  charge_categories.created_at from charge_categories
  join charge_type_master ON charge_categories.charge_type_id = charge_type_master.id`);
  return charge_category ;
}

async findOne(id: string): Promise<SetupHospitalChargesChargeCategory[]> {
  const charge_category = await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [id]);
  
    return charge_category ;
 
}

async findOneByType(id: string): Promise<SetupHospitalChargesChargeCategory[]> {
  const charge_category = await this.connection.query('SELECT * FROM charge_categories WHERE charge_type_id = ?', [id]);
  
    return charge_category ;
 
}

async update(id: string, charge_categoryEntity: SetupHospitalChargesChargeCategory): Promise<{ [key: string]: any }[]> {

  try {
    console.log("dddd");
    const result = await this.connection.query(
      'UPDATE charge_categories SET charge_type_id =?,name =?,description =?  WHERE id = ?',
      [charge_categoryEntity.charge_type_id, 
        charge_categoryEntity.name,
        charge_categoryEntity.description,
        id
      ]
    );

    return  [{"data ":{
    status:"success",
    "messege":"charge_categories details updated successfully inserted",
    "updated_values":await this.connection.query('SELECT * FROM charge_categories WHERE id = ?', [id])
    }}];
    
    
  } catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update charge_categories profile",
       "error":error
    }
    ]
  }
}

async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM charge_categories WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
}


}