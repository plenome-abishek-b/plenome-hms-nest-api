import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupPharmacySupplier } from './entities/setup_pharmacy_supplier.entity';


@Injectable()
export class SetupPharmacySupplierService {
  constructor(@InjectConnection() private connection: Connection) {}

  // create() {
  //   return 'This action adds a new setupPharmacySupplier';
  // }

  async create(supplierEntity: SetupPharmacySupplier ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO medicine_supplier (supplier,contact,supplier_person,supplier_person_contact,supplier_drug_licence,address) VALUES (?,?,?,?,?,?)',
      [supplierEntity.supplier,
        supplierEntity.contact,
        supplierEntity.supplier_person,
        supplierEntity.supplier_person_contact,
        supplierEntity.supplier_drug_licence,
        supplierEntity.address
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"supplier details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [result.insertId])
              }}];
  }




  // findAll() {
  //   return `This action returns all setupPharmacySupplier`;
  // }

  async findAll(): Promise<SetupPharmacySupplier[]> {
    const supplier = await this.connection.query('SELECT * FROM medicine_supplier');
    return supplier ;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} setupPharmacySupplier`;
  // }

  async findOne(id: string): Promise<SetupPharmacySupplier | null> {
    const supplier = await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [id]);
    
    if (supplier.length === 1) {
      return supplier ;
    } else {
      return null;
    }
  }

  // update(id: number, ) {
  //   return `This action updates a #${id} setupPharmacySupplier`;
  // }

  
  async update(id: string, supplierEntity: SetupPharmacySupplier): Promise<{ [key: string]: any }[]> {

    try {
      // console.log("hhhhhhhh",MedicineCategoryEntity.medicine_category);
      
      
      const result = await this.connection.query(
        'UPDATE medicine_supplier SET supplier =?,contact =?,supplier_person =?,supplier_person_contact =?,supplier_drug_licence =?,address =? WHERE id = ?',
        [supplierEntity.supplier, 
          supplierEntity.contact,
          supplierEntity.supplier_person,
          supplierEntity.supplier_person_contact,
          supplierEntity.supplier_drug_licence,
          supplierEntity.address,
         id
        ]
      );
  
      return  [{"data ":{
      status:"success",
      "message":"supplier details updated successfully ",
      "updated_values":await this.connection.query('SELECT * FROM medicine_supplier WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update medicine_supplier profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_supplier WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
