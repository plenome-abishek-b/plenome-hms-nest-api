import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SetupInventoryItemCategory } from './entities/setup-inventory-item_category.entity';


@Injectable()
export class SetupInventoryItemCategoryService {
 
  constructor(@InjectConnection() private connection: Connection) {}
  
  async create(item_categoryEntity: SetupInventoryItemCategory ): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query(
      'INSERT INTO item_category (item_category,is_active,description,created_at) VALUES (?,?,?,?)',
      [item_categoryEntity.item_category,
        item_categoryEntity.is_active,
        item_categoryEntity.description,
        item_categoryEntity.created_at
       
      ]
    );
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"item_category details added successfully inserted",
              "inserted_data": await this.connection.query('SELECT * FROM item_category WHERE id = ?', [result.insertId])
              }}];
  }




  async findAll(): Promise<SetupInventoryItemCategory[]> {
    const item_category = await this.connection.query('SELECT * FROM item_category');
    return item_category;
  }

  
  async findOne(id: string): Promise<SetupInventoryItemCategory | null> {
    const item_category = await this.connection.query('SELECT * FROM item_category WHERE id = ?', [id]);
    
    if (item_category.length === 1) {
      return item_category ;
    } else {
      return null;
    }
  }


  async update(id: string,item_categoryEntity: SetupInventoryItemCategory ): Promise<{ [key: string]: any }[]> {

    try {
      
      
      const result = await this.connection.query(
        'UPDATE item_category SET item_category =?,  description =? WHERE id = ?',
        [item_categoryEntity.item_category, 
          item_categoryEntity.description,
         id
        ]
      );
  console.log("kkkkkkkk");
  
      return  [{"data ":{
      status:"success",
      "messege":"item_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM item_category WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update item_category profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM item_category WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
