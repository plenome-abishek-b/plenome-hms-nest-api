import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupHumanResourceLeaveType } from './entities/setup-human_resource-leave_type.entity';


@Injectable()
export class SetupHumanResourceLeaveTypesService {
 
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(leavetypesEntity: SetupHumanResourceLeaveType ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO leave_types (type,is_active,created_at) VALUES (?,?,?)',
      [leavetypesEntity.type,
        leavetypesEntity.is_active,
        leavetypesEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"leave_types details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupHumanResourceLeaveType[]> {
    const leave_types = await this.connection.query('SELECT * FROM leave_types');
    return leave_types;
  }

  
  async findOne(id: string): Promise<SetupHumanResourceLeaveType | null> {
    const leave_types = await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [id]);
    
    if (leave_types.length === 1) {
      return leave_types ;
    } else {
      return null;
    }
  }


  async update(id: string, leavetypesEntity: SetupHumanResourceLeaveType): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE leave_types SET type =? WHERE id = ?',
        [leavetypesEntity.type, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"leave_types details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM leave_types WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update leave_types profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM leave_types WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
