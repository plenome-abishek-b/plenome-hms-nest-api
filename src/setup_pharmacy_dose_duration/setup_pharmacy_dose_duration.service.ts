import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupPharmacyDoseDuration } from './entities/setup_pharmacy_dose_duration.entity';

@Injectable()
export class SetupPharmacyDoseDurationService {
  constructor(@InjectConnection() private connection: Connection) {}
  
  // create() {
  //   return 'This action adds a new setupPharmacyDoseDuration';
  // }

  async create(dose_durationEntity: SetupPharmacyDoseDuration ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO dose_duration (name) VALUES (?)',
      [dose_durationEntity.name
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"dose_duration details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [result.insertId])
              }}];
  }


  // findAll() {
  //   return `This action returns all setupPharmacyDoseDuration`;
  // }

  async findAll(): Promise<SetupPharmacyDoseDuration[]> {
    const dose_duration = await this.connection.query('SELECT * FROM dose_duration');
    return dose_duration ;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} setupPharmacyDoseDuration`;
  // }


  async findOne(id: string): Promise<SetupPharmacyDoseDuration | null> {
    const dose_duration = await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [id]);
    
    if (dose_duration.length === 1) {
      return dose_duration as SetupPharmacyDoseDuration;
    } else {
      return null;
    }
  }

  // update(id: number, ) {
  //   return `This action updates a #${id} setupPharmacyDoseDuration`;
  // }


  async update(id: string, dose_durationEntity: SetupPharmacyDoseDuration ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE dose_duration SET name =? WHERE id = ?',
        [dose_durationEntity.name, 
         id
        ]
      );
  console.log("rrrrrrrrrddddddd");
  
      return  [{"data ":{
      status:"success",
      "messege":"dose_duration details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM dose_duration WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update dose_duration profile",
         "error":error
      }
      ]
    }
  }


  // remove(id: number) {
  //   return `This action removes a #${id} setupPharmacyDoseDuration`;
  // }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM dose_duration WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
