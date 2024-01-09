import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupOperationOperationCategory } from './entities/setup-operation-operation_category.entity';

@Injectable()
export class SetupOperationOperationCategoryService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(operation_categoryrEntity: SetupOperationOperationCategory ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO operation_category (category,is_active) VALUES (?,?)',
      [operation_categoryrEntity.category,
        operation_categoryrEntity.is_active,
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"operation_category details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [result.insertId])
              }}];
  }

  
  async findAll(): Promise<SetupOperationOperationCategory[]> {
    const operation_category = await this.connection.query('SELECT * FROM operation_category');
    return operation_category ;
  }
    
  

  
  async findOne(id: string): Promise<SetupOperationOperationCategory | null> {
    const unit = await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [id]);
    
    if (unit.length === 1) {
      return unit ;
    } else {
      return null;
    }
  }


  async update(id: string, operation_categoryrEntity: SetupOperationOperationCategory): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE operation_category SET category =? WHERE id = ?',
        [ operation_categoryrEntity.category,
         id
        ]
      );
  console.log("sssss");
  
      return  [{"data ":{
      status:"success",
      "messege":"operation_category details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM operation_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update operation_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM operation_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }  
}
