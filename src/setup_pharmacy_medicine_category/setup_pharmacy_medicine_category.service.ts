import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
// import { MedicineCategory } from './entities/medicine_category.entity';
import { SetupPharmacyMedicineCategory } from './entities/setup_pharmacy_medicine_category.entity';
@Injectable()
export class MedicineCategoryService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(MedicineCategoryEntity: SetupPharmacyMedicineCategory ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO medicine_category (medicine_category) VALUES (?)',
      [MedicineCategoryEntity.medicine_category
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"medicine_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupPharmacyMedicineCategory[]> {
    const medicine_category = await this.connection.query('SELECT * FROM medicine_category');
    return medicine_category as SetupPharmacyMedicineCategory[];
  }

  
  async findOne(id: string): Promise<SetupPharmacyMedicineCategory | null> {
    const medicine_category = await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [id]);
    
    if (medicine_category.length === 1) {
      return medicine_category ;
    } else {
      return null;
    }
  }


  async update(id: string, MedicineCategoryEntity: SetupPharmacyMedicineCategory): Promise<{ [key: string]: any }[]> {

    try {
      console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE medicine_category SET medicine_category =? WHERE id = ?',
        [MedicineCategoryEntity.medicine_category, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"medicine_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM medicine_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}