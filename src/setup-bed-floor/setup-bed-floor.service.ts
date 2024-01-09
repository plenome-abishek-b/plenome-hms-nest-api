import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupBedFloor } from './entities/setup-bed-floor.entity';
@Injectable()
export class SetupBedFloorService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(floorEntity: SetupBedFloor ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO floor (name,description) VALUES (?,?)',
      [floorEntity.name,
        floorEntity.description
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"floor details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM floor WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupBedFloor[]> {
    const floor = await this.connection.query('SELECT * FROM floor');
    return floor ;
  }

  
  async findOne(id: string): Promise<SetupBedFloor | null> {
    const floor = await this.connection.query('SELECT * FROM floor WHERE id = ?', [id]);
    
    if (floor.length === 1) {
      return floor;
    } else {
      return null;
    }
  }


  async update(id: string, floorEntity: SetupBedFloor ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE floor SET name =?, description =? WHERE id = ?',
        [floorEntity.name,
          floorEntity.description,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"floor details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM floor WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update floor profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM floor WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }

}
