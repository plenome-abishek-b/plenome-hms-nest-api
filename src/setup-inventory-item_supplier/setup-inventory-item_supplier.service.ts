import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupInventoryItemSupplier } from './entities/setup-inventory-item_supplier.entity';

@Injectable()
export class SetupInventoryItemSupplierService {
  constructor(@InjectConnection() private connection: Connection) {}

  
  async create(item_supplierEntity: SetupInventoryItemSupplier ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO item_supplier (item_supplier,phone,email,address,contact_person_name,contact_person_phone,contact_person_email,description,created_at) VALUES (?,?,?,?,?,?,?,?,?)',
      [item_supplierEntity.item_supplier,
        item_supplierEntity.phone,
        item_supplierEntity.email,
        item_supplierEntity.address,
        item_supplierEntity.contact_person_name,
        item_supplierEntity.contact_person_phone,
        item_supplierEntity.contact_person_email,
        item_supplierEntity.description,
        item_supplierEntity.created_at
        
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_supplier details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupInventoryItemSupplier[]> {
    const item_supplier = await this.connection.query('SELECT * FROM item_supplier');
    return item_supplier ;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemSupplier | null> {
    const item_supplier = await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [id]);
    
    if (item_supplier.length === 1) {
      return item_supplier ;
    } else {
      return null;
    }
  }


  async update(id: string, item_supplierEntity: SetupInventoryItemSupplier): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_supplier SET item_supplier =?, phone =?, email =?, address =?, contact_person_name =?, contact_person_phone =?, contact_person_email =?, description =?  WHERE id = ?',
        [item_supplierEntity.item_supplier,
          item_supplierEntity.phone,
          item_supplierEntity.email,
          item_supplierEntity.address,
          item_supplierEntity.contact_person_name,
          item_supplierEntity.contact_person_phone,
          item_supplierEntity.contact_person_email,
          item_supplierEntity.description,
          
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"item_supplier details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_supplier WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_supplier profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM medicine_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
