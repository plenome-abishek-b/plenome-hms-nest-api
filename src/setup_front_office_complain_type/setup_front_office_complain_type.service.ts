import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFrontOfficeComplainType } from './entities/setup_front_office_complain_type.entity';


@Injectable()
export class SetupFrontOfficeComplainTypeService {

  constructor(@InjectConnection() private connection: Connection) {}

  // create(createSetupFrontOfficeComplainTypeDto: CreateSetupFrontOfficeComplainTypeDto) {
  //   return 'This action adds a new setupFrontOfficeComplainType';
  // }

  async create(complain_typeEntity: SetupFrontOfficeComplainType ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO complaint_type (complaint_type,description) VALUES (?,?)',
      [complain_typeEntity.complaint_type,
        complain_typeEntity.description
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"complaint_type details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [result.insertId])
              }}];
  }

  // findAll() {
  //   return `This action returns all setupFrontOfficeComplainType`;
  // }

  async findAll(): Promise<SetupFrontOfficeComplainType[]> {
    const complaint_type = await this.connection.query('SELECT * FROM complaint_type');
    return complaint_type ;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} setupFrontOfficeComplainType`;
  // }

  async findOne(id: string): Promise<SetupFrontOfficeComplainType | null> {
    const complaint_type = await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [id]);
    
    // if (complaint_type.length === 1) {
      return complaint_type;
    // } else {
    //   return null;
    // }
  }

  // update(id: number, updateSetupFrontOfficeComplainTypeDto: UpdateSetupFrontOfficeComplainTypeDto) {
  //   return `This action updates a #${id} setupFrontOfficeComplainType`;
  // }

  async update(id: string, complain_typeEntity: SetupFrontOfficeComplainType): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE complaint_type SET complaint_type =?, description = ? WHERE id = ?',
        [complain_typeEntity.complaint_type,
          complain_typeEntity.description,
         id
        ]
      );
  
      return  [{"data ":{
      status:"success",
      "messege":"complaint_type details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM complaint_type WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "message":"cannot update complaint_type profile",
         "error":error
      }
      ]
    }
  }


  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM complaint_type WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
