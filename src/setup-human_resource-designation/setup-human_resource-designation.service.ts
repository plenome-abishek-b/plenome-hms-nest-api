import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHumanResourceDesignation } from './entities/setup-human_resource-designation.entity';


@Injectable()
export class SetupHumanResourceDesignationService {
  
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(designationEntity:SetupHumanResourceDesignation ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO staff_designation (designation,is_active) VALUES (?,?)',
      [designationEntity.designation,
        designationEntity.is_active
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"staff_designation details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceDesignation[]> {
    const staff_designation = await this.connection.query('SELECT * FROM staff_designation');
    return staff_designation ;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceDesignation | null> {
    const staff_designation = await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [id]);
    
    if (staff_designation.length === 1) {
      return staff_designation ;
    } else {
      return null;
    }
  }


  async update(id: string, designationEntity: SetupHumanResourceDesignation): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE staff_designation SET designation =? WHERE id = ?',
        [designationEntity.designation, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"staff_designation details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM staff_designation WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update staff_designation profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM staff_designation WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
