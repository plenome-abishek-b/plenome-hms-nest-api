import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupPatientNewPatient } from './entities/setup-patient-new_patient.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
@Injectable()
export class SetupPatientNewPatientService {

  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create(new_patientEntity: SetupPatientNewPatient ): Promise<{ [key: string]: any }[]> {
 
    const result = await this.connection.query(
      `INSERT INTO patients ( patient_name, dob, image,  mobileno, email, gender, marital_status,blood_bank_product_id,
         address,guardian_name,ABHA_number, known_allergies, note,insurance_id, insurance_validity
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); `,
      [
        new_patientEntity.patient_name,
        new_patientEntity.dob,
        new_patientEntity.image,
        new_patientEntity.mobileno,
        new_patientEntity.email,
        new_patientEntity.gender,
        new_patientEntity.marital_status,
        new_patientEntity.blood_bank_product_id,
        new_patientEntity.address,
        new_patientEntity.guardian_name,
        new_patientEntity.ABHA_number,
        new_patientEntity.known_allergies,
        new_patientEntity.note,
        new_patientEntity.insurance_id,
        new_patientEntity.insurance_validity       
      ]
    );

  

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"patients details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM patients WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupPatientNewPatient[]> {
    const patients = await this.connection.query('select patients.id, patients.patient_name, patients.dob, patients.age,patients.gender,patients.mobileno,patients.guardian_name,patients.address,patients.is_dead,patients.insurance_id,patients.insurance_validity,patients.ABHA_number from patients where is_active = ?', ['yes']);
    return patients ;
  }

  
  async findOne(id: string){
    const patients = await this.connection.query(`select patients.id,patients.patient_name,patients.guardian_name,patients.gender,blood_bank_products.is_blood_group,patients.marital_status, 
    concat(patients.age,"year"," " ,patients.month,"months"," " , patients.day,"days") as age,
    patients.mobileno,patients.email,patients.address,patients.known_allergies,patients.note,
    patients.insurance_id,patients.insurance_validity,patients.ABHA_number from patients
    left join blood_bank_products on patients.blood_bank_product_id = blood_bank_products.id
     where patients.id = ?`, [id]);
    {
      return patients ;
    } 
  }


  async update(id: number, new_patientEntity: SetupPatientNewPatient): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE patients SET patient_name =?,  guardian_name =?,  gender =?,  dob =?,  blood_group =?, marital_status =?, image =?,   mobileno =?, email =?, address =?, note =?, known_allergies = ?, insurance_id=?, insurance_validity=?, ABHA_number =? WHERE id = ?',
        [new_patientEntity.patient_name,
          new_patientEntity.guardian_name,
          new_patientEntity.gender,
          new_patientEntity.dob,
          new_patientEntity.blood_group,
          new_patientEntity.marital_status,
          new_patientEntity.image,
          new_patientEntity.mobileno,
          new_patientEntity.email,
          new_patientEntity.address,
          new_patientEntity.note,
          new_patientEntity.known_allergies,
          new_patientEntity.insurance_id,
          new_patientEntity.insurance_validity,
          new_patientEntity.ABHA_number, 
         id
        ]
      );
  console.log("kkkkkkkk");

  
  
  

  
      return  [{"data ":{
      status:"success",
      "messege":"new patients details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM patients WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update patients profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM patients WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
