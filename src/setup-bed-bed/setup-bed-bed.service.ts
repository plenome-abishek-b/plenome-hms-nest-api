import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupBedBed } from './entities/setup-bed-bed.entity';

@Injectable()
export class SetupBedBedService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(bedEntity: SetupBedBed ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO bed (name,bed_type_id,bed_group_id,is_active) VALUES (?,?,?,?)',
      [bedEntity.name,
        bedEntity.bed_type_id,
        bedEntity.bed_group_id,
        bedEntity.is_active,
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"bed details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM bed WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupBedBed[]> {
    const bed = await this.connection.query("SELECT bed.name, bed.is_active as used, bed_type.name as Bed_Type, CONCAT(bed_group.name, '-', floor.name) AS bed_group FROM bed JOIN bed_type ON bed.bed_type_id = bed_type.id JOIN bed_group ON bed.bed_group_id = bed_group.id JOIN floor ON bed_group.floor = floor.id");
    return bed  ;
  }

  
  async findOne(id: string): Promise<SetupBedBed | null> {
    const bed = await this.connection.query("SELECT bed.name, bed.is_active as used, bed_type.name as Bed_Type, CONCAT(bed_group.name, '-', floor.name) AS bed_group FROM bed JOIN bed_type ON bed.bed_type_id = bed_type.id JOIN bed_group ON bed.bed_group_id = bed_group.id JOIN floor ON bed_group.floor = floor.id WHERE bed.id = ?", [id]);
    
    if (bed.length === 1) {
      return bed ;
    } else {
      return null;
    }
  }


  async update(id: string, bedEntity: SetupBedBed ): Promise<{ [key: string]: any }[]> {

    try {
      
      const result = await this.connection.query(
        'UPDATE bed SET name =?, bed_type_id =?, bed_group_id =?, is_active =? WHERE id = ?',
        [bedEntity.name, 
          bedEntity.bed_type_id,
          bedEntity.bed_group_id,
          bedEntity.is_active,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"bed details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM bed WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update bed profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM bed WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
