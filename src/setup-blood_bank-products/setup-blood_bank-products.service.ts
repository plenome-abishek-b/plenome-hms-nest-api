import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupBloodBankProduct } from './entities/setup-blood_bank-product.entity';

@Injectable()
export class SetupBloodBankProductsService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(bloodproductsEntity: SetupBloodBankProduct ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO blood_bank_products (name,is_blood_group) VALUES (?,?)',
      [bloodproductsEntity.name,
        bloodproductsEntity.is_blood_group
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"blood_bank_products details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [result.insertId])
              }}];
  }

  async findAll(): Promise<SetupBloodBankProduct[]> {
    const blood_bank_products = await this.connection.query('SELECT * FROM blood_bank_products where is_blood_group = ?',['1']);
    return blood_bank_products ;
  }
  
  async findOne(id: string): Promise<SetupBloodBankProduct | null> {
    const blood_bank_products = await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [id]);
    
    if (blood_bank_products.length === 1) {
      return blood_bank_products ;
    } else {
      return null;
    }
  }

  async update(id: string, bloodproductsEntity: SetupBloodBankProduct): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE blood_bank_products SET name =? ,is_blood_group =?  WHERE id = ?',
        [bloodproductsEntity.name,
          bloodproductsEntity.is_blood_group,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"blood_bank_products details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM blood_bank_products WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update blood_bank_products profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM blood_bank_products WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
