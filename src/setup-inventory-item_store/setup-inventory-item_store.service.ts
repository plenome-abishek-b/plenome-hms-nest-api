import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupInventoryItemStore } from './entities/setup-inventory-item_store.entity';


@Injectable()
export class SetupInventoryItemStoreService {
 
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(item_storeEntity: SetupInventoryItemStore ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO item_store (item_store,code,description,created_at) VALUES (?,?,?,?)',
      [item_storeEntity.item_store,
        item_storeEntity.code,
        item_storeEntity.description,
        item_storeEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_store details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_store WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupInventoryItemStore[]> {
    const item_store = await this.connection.query('SELECT * FROM item_store');
    return item_store ;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemStore | null> {
    const item_store = await this.connection.query('SELECT * FROM item_store WHERE id = ?', [id]);
    
    if (item_store.length === 1) {
      return item_store ;
    } else {
      return null;
    }
  }


  async update(id: string,item_storeEntity: SetupInventoryItemStore ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_store SET item_store =?, code =?, description =? WHERE id = ?',
        [item_storeEntity.item_store, 
          item_storeEntity.code,
          item_storeEntity.description,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"item_store details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_store WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_store profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM item_store WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
