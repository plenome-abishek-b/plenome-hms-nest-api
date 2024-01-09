import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupFrontOfficeSource } from './entities/setup_front_office_source.entity';
@Injectable()
export class SetupFrontOfficeSourceService {
  constructor(@InjectConnection() private connection: Connection) {}

  // create( ) {
  //   return 'This action adds a new setupFrontOfficeSource';
  // }

  async create(sourceEntity: SetupFrontOfficeSource ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO source (source,description) VALUES (?,?)',
      [sourceEntity.source,
        sourceEntity.description
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"source details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM source WHERE id = ?', [result.insertId])
              }}];
  }

  // findAll() {
  //   return `This action returns all setupFrontOfficeSource`;
  // }

  async findAll(): Promise<SetupFrontOfficeSource[]> {
    const source = await this.connection.query('SELECT * FROM source');
    return source ;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} setupFrontOfficeSource`;
  // }

  async findOne(id: string): Promise<SetupFrontOfficeSource | null> {
    const source = await this.connection.query('SELECT * FROM source WHERE id = ?', [id]);
    
    if (source.length === 1) {
      return  source;
    } else {
      return null;
    }
  }

  // update(id: number, ) {
  //   return `This action updates a #${id} setupFrontOfficeSource`;
  // }

  
  async update(id: string, sourceEntity: SetupFrontOfficeSource): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE source SET source =?, description = ? WHERE id = ?',
        [sourceEntity.source,
          sourceEntity.description,
         id
        ]
      );
  
      return  [{"data ":{
      status:"success",
      "messege":"source details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM source WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "message":"cannot update source profile",
         "error":error
      }
      ]
    }
  }

  // remove(id: number) {
  //   return `This action removes a #${id} setupFrontOfficeSource`;

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM source WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
