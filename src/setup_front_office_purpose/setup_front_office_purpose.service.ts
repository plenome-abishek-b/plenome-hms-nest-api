import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFrontOfficePurpose } from './entities/setup_front_office_purpose.entity';
@Injectable()
export class SetupFrontOfficePurposeService {
  constructor(@InjectConnection() private connection: Connection) {}

  // create() {
  //   return 'This action adds a new setupFrontOfficePurpose';
  // }

  async create(purposeEntity: SetupFrontOfficePurpose ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO visitors_purpose (visitors_purpose,description) VALUES (?,?)',
      [purposeEntity.visitors_purpose,
        purposeEntity.description
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"purpose details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [result.insertId])
              }}];
  }


  // findAll() {
  //   return `This action returns all setupFrontOfficePurpose`;
  // }

  async findAll(): Promise<SetupFrontOfficePurpose[]> {
    const purpose = await this.connection.query('SELECT * FROM visitors_purpose');
    return purpose ;
  }


  // findOne(id: number) {
  //   return `This action returns a #${id} setupFrontOfficePurpose`;
  // }

  async findOne(id: string): Promise<SetupFrontOfficePurpose | null> {
    const purpose = await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [id]);
    
    if (purpose.length === 1) {
      return purpose ;
    } else {
      return null;
    }
  }


  // update(id: number,  ) {
  //   return `This action updates a #${id} setupFrontOfficePurpose`;
  // }

  async update(id: string, purposeEntity: SetupFrontOfficePurpose): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE visitors_purpose SET visitors_purpose =?, description = ? WHERE id = ?',
        [purposeEntity.visitors_purpose,
          purposeEntity.description, 
         id
        ]
      );
  
      return  [{"data ":{
      status:"success",
      "messege":"visitors_purpose details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM visitors_purpose WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update visitors_purpose profile",
         "error":error
      }
      ]
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} setupFrontOfficePurpose`;
  // }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM visitors_purpose WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
