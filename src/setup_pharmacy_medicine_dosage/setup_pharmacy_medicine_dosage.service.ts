import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupPharmacyMedicineDosage } from './entities/setup_pharmacy_medicine_dosage.entity';

@Injectable()
export class SetupPharmacyMedicineDosageService {
  constructor(@InjectConnection() private connection: Connection) {}

  // create() {
  //   return 'This action adds a new setupPharmacyMedicineDosage';
  // }

  async create(Medicine_dosageEntity: SetupPharmacyMedicineDosage ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO medicine_dosage (medicine_category_id,dosage,charge_units_id,created_at) VALUES (?,?,?,?)',
      [Medicine_dosageEntity.medicine_category_id,
        Medicine_dosageEntity.dosage,
        Medicine_dosageEntity.charge_units_id,
        Medicine_dosageEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"medicine_dosage details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [result.insertId])
              }}];
  }


  // findAll() {
  //   return `This action returns all setupPharmacyMedicineDosage`;
  // }

  async findAll(): Promise<SetupPharmacyMedicineDosage[]> {
    const medicine_dosage = await this.connection.query('select medicine_dosage.id, medicine_dosage.dosage,charge_units.unit, medicine_category.medicine_category from medicine_dosage  join charge_units on charge_units.id = medicine_dosage.charge_units_id  join medicine_category on medicine_category.id = medicine_dosage.medicine_category_id');
    return medicine_dosage ;
  }


  async findOne(id: string): Promise<SetupPharmacyMedicineDosage | null> {
    const medicine_dosage = await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [id]);
    
    if (medicine_dosage.length === 1) {
      return medicine_dosage ;
    } else {
      return null;
    }
  }

  async update(id: string, Medicine_dosageEntity: SetupPharmacyMedicineDosage ): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE medicine_dosage SET medicine_category_id =?,dosage =?,charge_units_id =? WHERE id = ?',
        [Medicine_dosageEntity.medicine_category_id,
          Medicine_dosageEntity.dosage,
          Medicine_dosageEntity.charge_units_id, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"medicine_dosage details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM medicine_dosage WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_dosage profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_dosage WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
