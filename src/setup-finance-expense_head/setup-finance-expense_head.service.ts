import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFinanceExpenseHead } from './entities/setup-finance-expense_head.entity';
@Injectable()
export class SetupFinanceExpenseHeadService {
 
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(expense_headEntity: SetupFinanceExpenseHead ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO expense_head (exp_category,description,is_active,is_deleted) VALUES (?,?,?,?)',
      [expense_headEntity.exp_category,
        expense_headEntity.description,
        expense_headEntity.is_active,
        expense_headEntity.is_deleted
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"expense_head details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM expense_head WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupFinanceExpenseHead[]> {
    const expense_head = await this.connection.query('SELECT * FROM expense_head');
    return expense_head ;
  }

  
  async findOne(id: string): Promise<SetupFinanceExpenseHead | null> {
    const expense_head = await this.connection.query('SELECT * FROM expense_head WHERE id = ?', [id]);
    
    if (expense_head.length === 1) {
      return expense_head ;
    } else {
      return null;
    }
  }


  async update(id: string, expense_headEntity: SetupFinanceExpenseHead): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE expense_head SET exp_category =?, description =? WHERE id = ?',
        [expense_headEntity.exp_category,
          expense_headEntity.description, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"expense_head details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM expense_head WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update expense_head profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM expense_head WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
