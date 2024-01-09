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
      'INSERT INTO patients ( lang_id, patient_name, dob, age, month, day, image,  mobileno, email, gender, marital_status,blood_group,blood_bank_product_id, address,guardian_name, patient_type,ABHA_number, known_allergies, note,is_ipd,app_key , insurance_id,   insurance_validity, is_dead, is_active, disable_at, created_at,   pincode, state_code, district_code, emergency_mobile_no ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?); ',
      [new_patientEntity.lang_id,
        new_patientEntity.patient_name,
        new_patientEntity.dob,
        new_patientEntity.age,
        new_patientEntity.month,
        new_patientEntity.day,
        new_patientEntity.image,
        new_patientEntity.mobileno,
        new_patientEntity.email,
        new_patientEntity.gender,
        new_patientEntity.marital_status,
        new_patientEntity.blood_group,
        new_patientEntity.blood_bank_product_id,
        new_patientEntity.address,
        new_patientEntity.guardian_name,
        new_patientEntity.patient_type,
        new_patientEntity.ABHA_number,
        new_patientEntity.known_allergies,
        new_patientEntity.note,
        new_patientEntity.is_ipd,
        new_patientEntity.app_key,
        new_patientEntity.insurance_id,
        new_patientEntity.insurance_validity,
        new_patientEntity.is_dead,
        new_patientEntity.is_active,
        new_patientEntity.disable_at,
        new_patientEntity.created_at,
        new_patientEntity.pincode,
        new_patientEntity.state_code,
        new_patientEntity.district_code,
        new_patientEntity.emergency_mobile_no
       
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
 
 
  async findOne(id: string): Promise<SetupPatientNewPatient | null> {
    const patients = await this.connection.query('select patients.id, patients.patient_name,patients.dob, patients.age,patients.gender,patients.mobileno,patients.guardian_name,patients.address,patients.is_dead,patients.insurance_id,patients.insurance_validity,patients.ABHA_number from patients WHERE id = ?', [id]);
   
    if (patients.length === 1) {
      return patients ;
    } else {
      return null;
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