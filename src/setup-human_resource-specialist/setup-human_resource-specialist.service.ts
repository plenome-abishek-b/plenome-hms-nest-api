import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHumanResourceSpecialist } from './entities/setup-human_resource-specialist.entity';

@Injectable()
export class SetupHumanResourceSpecialistService {
  
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(specialsitEntity: SetupHumanResourceSpecialist ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO specialist (specialist_name,is_active) VALUES (?,?)',
      [specialsitEntity.specialist_name,
        specialsitEntity.is_active
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"specialist details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM specialist WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceSpecialist[]> {
    const specialsist = await this.connection.query('SELECT * FROM specialist');
    return specialsist ;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceSpecialist | null> {
    const specialsist = await this.connection.query('SELECT * FROM specialist WHERE id = ?', [id]);
    
    if (specialsist.length === 1) {
      return specialsist ;
    } else {
      return null;
    }
  }


  async update(id: string, specialsitEntity: SetupHumanResourceSpecialist ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE specialist SET specialist_name =? WHERE id = ?',
        [specialsitEntity.specialist_name, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"specialist details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM specialist WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update specialist profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM specialist WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
