import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupOperationOperation } from './entities/setup-operation-operation.entity';


@Injectable()
export class SetupOperationOperationService {
  constructor(@InjectConnection() private connection: Connection) {}


  async create(operationEntity: SetupOperationOperation ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO operation (operation,category_id,) VALUES (?,?)',
      [operationEntity.operation,
        operationEntity.category_id
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"operation details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM operation WHERE id = ?', [result.insertId])
              }}];

            
  }

  async findAll(): Promise<SetupOperationOperation[]> {
    const operation = await this.connection.query('SELECT * FROM operation');
    return operation;
  }

  async findOne(id: string): Promise<SetupOperationOperation | null> {
    const operation = await this.connection.query('SELECT * FROM operation WHERE id = ?', [id]);
    
    if (operation.length === 1) {
      return operation ;
    } else {
      return null;
    }
  }

  
  async update(id: string, operationEntity: SetupOperationOperation ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE operation SET operation =?,category_id =? WHERE id = ?',
        [operationEntity.operation,
          operationEntity.category_id, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"operation details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM operation WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update operation profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM operation WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
