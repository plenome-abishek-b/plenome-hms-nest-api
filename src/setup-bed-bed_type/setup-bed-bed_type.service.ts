import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupBedBedType } from './entities/setup-bed-bed_type.entity';

@Injectable()
export class SetupBedBedTypeService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(bed_typeEntity: SetupBedBedType ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO bed_type (name) VALUES (?)',
      [bed_typeEntity.name,
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"bed_type details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupBedBedType[]> {
    const bed_type = await this.connection.query('SELECT * FROM bed_type');
    return bed_type ;
  }

  
  async findOne(id: string): Promise<SetupBedBedType | null> {
    const bed_type = await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [id]);
    
    if (bed_type.length === 1) {
      return bed_type ;
    } else {
      return null;
    }
  }


  async update(id: string, bed_typeEntity: SetupBedBedType): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE bed_type SET name =? WHERE id = ?',
        [bed_typeEntity.name, 
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"bed_type details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM bed_type WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update bed_type profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM bed_type WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
