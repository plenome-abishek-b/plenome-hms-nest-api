import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHospitalChargeCharge } from './entities/setup-hospital_charge-charge.entity';

@Injectable()
export class SetupHospitalChargeChargesService {

  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(chargesEntity: SetupHospitalChargeCharge ): Promise<{ [key: string]: any }[]> {
    console.log("aaaaaaaaaa", chargesEntity.name);

    const result = await this.connection.query(
      'INSERT INTO charges (charge_category_id,tax_category_id,charge_unit_id,name,standard_charge,date,description,status,created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [chargesEntity.charge_category_id,
        chargesEntity.tax_category_id,
        chargesEntity.charge_unit_id,
        chargesEntity.name,
        chargesEntity.standard_charge,
        chargesEntity.date,
        chargesEntity.description,
        chargesEntity.status,
        chargesEntity.created_at
       
      ]
    );

    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charges details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM charges WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHospitalChargeCharge[]> {
    const charges = await this.connection.query('select charges.id,charges.name,charge_categories.name as charge_category,charge_type_master.charge_type,charge_units.unit,tax_category.percentage as tax, charges.standard_charge from charges  left join charge_categories ON charges.charge_category_id = charge_categories.id  left join charge_units ON charges.charge_unit_id = charge_units.id left join tax_category ON charges.tax_category_id = tax_category.id left join charge_type_master ON charge_type_master.id = charge_categories.charge_type_id;');
   console.log("vvvvvvv")
    return charges ;
  }

  
  async findOne(id: string): Promise<SetupHospitalChargeCharge | null> {
    const charges = await this.connection.query('select charges.id,charges.name,charge_categories.name as charge_category,charge_type_master.charge_type,charge_units.unit,tax_category.percentage as tax, charges.standard_charge from charges  left join charge_categories ON charges.charge_category_id = charge_categories.id  left join charge_units ON charges.charge_unit_id = charge_units.id left join tax_category ON charges.tax_category_id = tax_category.id left join charge_type_master ON charge_type_master.id = charge_categories.charge_type_id WHERE charges.id = ?', [id]);
    
    if (charges.length === 1) {
      return charges ;
    } else {
      return null;
    }
  }


  async update(id: string,chargesEntity: SetupHospitalChargeCharge): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE charges SET charge_category_id =?,tax_category_id =? ,charge_unit_id =? ,name =? ,standard_charge =? ,date =? ,description =? ,status =?  WHERE id = ?',
        [chargesEntity.charge_category_id,
          chargesEntity.tax_category_id,
          chargesEntity.charge_unit_id,
          chargesEntity.name,
          chargesEntity.standard_charge,
          chargesEntity.date,
          chargesEntity.description,
          chargesEntity.status, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"medicine_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM charges WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update charges profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM charges WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}