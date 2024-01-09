import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFinanceIncomeHead } from './entities/setup-finance-income_head.entity';
@Injectable()
export class SetupFinanceIncomeHeadService {
  constructor(@InjectConnection() private connection: Connection) {}

  async create(income_headEntity: SetupFinanceIncomeHead ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO income_head (income_category,description,is_active,is_deleted) VALUES (?,?,?,?)',
      [income_headEntity.income_category,
        income_headEntity.description,
        income_headEntity.is_active,
        income_headEntity.is_deleted
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"income_head details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM income_head WHERE id = ?', [result.insertId])
              }}];
  }
 

  async findAll(): Promise<SetupFinanceIncomeHead[]> {
    const income_head = await this.connection.query('SELECT * FROM income_head');
    return income_head ;
  }

  async findOne(id: string): Promise<SetupFinanceIncomeHead | null> {
    const income_head = await this.connection.query('SELECT * FROM income_head WHERE id = ?', [id]);
    
    if (income_head.length === 1) {
      return income_head ;
    } else {
      return null;
    }
  }


  async update(id: string, income_headEntity: SetupFinanceIncomeHead  ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE income_head SET income_category =?, description =? WHERE id = ?',
        [income_headEntity.income_category, 
          income_headEntity.description,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"income_head details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM income_head WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update income_head profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM income_head WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
