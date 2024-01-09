import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFindingsFinding } from './entities/setup-findings-finding.entity';
@Injectable()
export class SetupFindingsFindingService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(findingEntity: SetupFindingsFinding ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO finding (name,description,finding_category_id,created_at) VALUES (?,?,?,?)',
      [findingEntity.name,
        findingEntity.description,
        findingEntity.finding_category_id,
        findingEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"finding details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM finding WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupFindingsFindingService[]> {
    const finding = await this.connection.query('SELECT * FROM finding');
    return finding ;
  }

  
  async findOne(id: string): Promise<SetupFindingsFindingService | null> {
    const finding = await this.connection.query('SELECT * FROM finding WHERE id = ?', [id]);
    
    if (finding.length === 1) {
      return finding ;
    } else {
      return null;
    }
  }

  async update(id: string, findingEntity: SetupFindingsFinding): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE finding SET name =?,description =?,finding_category_id =?  WHERE id = ?',
        [findingEntity.name, 
          findingEntity.description,
          findingEntity.finding_category_id,
         id
        ]
      );
  
      return  [{"data ":{
      status:"success",
      "message":"finding details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM finding WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update finding profile",
         "error":error
      }
      ]
    }
  }
  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM finding WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}