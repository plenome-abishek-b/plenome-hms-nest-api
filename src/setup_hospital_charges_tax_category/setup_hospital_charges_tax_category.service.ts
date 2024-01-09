import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHospitalChargesTaxCategory } from './entities/setup_hospital_charges_tax_category.entity';

@Injectable()
export class tax_categoryservice {
  constructor(@InjectConnection() private connection: Connection) {}


  async create(tax_categoryEntity: SetupHospitalChargesTaxCategory ): Promise<{[key: string]: any}[]>{
    const result = await this.connection.query(
      'INSERT INTO tax_category (name,percentage) VALUES (?,?)',
      [tax_categoryEntity.name,
        tax_categoryEntity.percentage
       
      ]
    );
   
     return [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"tax_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [result.insertId])
              }}];
  }


  async findAll() {
    const tax_category = await this.connection.query('SELECT * FROM tax_category');
    return tax_category ;
  }

  async findOne(id: number) {
    const tax_category = await this.connection.query('SELECT * FROM tax_category where id = ?',[id]);
    return tax_category;
    // return `This action returns a #${id} setupHospitalChargesTaxCategory`;
  }

 async update(id: number, tax_categoryEntity: SetupHospitalChargesTaxCategory ):Promise<{ [key:string]: any}[]> {
  try {
    const result = await this.connection.query(
      'update tax_category SET name = ?, percentage = ? where id = ?',
      [tax_categoryEntity.name,
        tax_categoryEntity.percentage,
        id

      ]
    );
    return  [{"data ":{
      status:"success",
      "message":"tax_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update tax_category module",
  }
  ]
}
 }

 async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM tax_category WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
  }
}
