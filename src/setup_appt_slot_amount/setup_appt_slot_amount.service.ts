import { Injectable } from '@nestjs/common';
import { SetupApptSlotAmount } from './entities/setup_appt_slot_amount.entity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class SetupApptSlotAmountService {

  constructor(@InjectConnection() private connection: Connection) {}

async  create(slotEntity: SetupApptSlotAmount) {
const [check] = await this.connection.query('select staff_id from shift_details where staff_id = ?',[slotEntity.staff_id])
console.log(check);
  console.log("entering if",check);

  if(check){
    console.log("entering if",check);
    
return "already irukku update pannanum"
  }
else{
  console.log("entering else",check);

  const insert = await this.connection.query(`insert into shift_details(staff_id,
    consult_duration,
    charge_id) values (?,?,?)`,[
      slotEntity.staff_id,
      slotEntity.consult_duration,
      slotEntity.charge_id
    ])
  // return "inserted id is : "+insert.insertId;
  return [{"data ":{"id  ":insert.insertId,
  "status":"success",
  "messege":"shift_details details added successfully inserted",
  "inserted_data": await this.connection.query('SELECT * FROM shift_details WHERE id = ?', [insert.insertId])
  }}];
}
}

  

async  findforDocAndGlobalShift(staff_id:number) {
  const getCharge = await this.connection.query(`select shift_details.id, shift_details.consult_duration,charges.name charge_name,
  charges.charge_category_id,charges.id,charges.standard_charge,charge_categories.name charge_category_name
   from shift_details left join charges on charges.id = shift_details.charge_id
   left join charge_categories on charge_categories.id = charges.charge_category_id where shift_details.staff_id = ?`,
   [staff_id])
    return getCharge;
  }



async update(id: number, slotEntity: SetupApptSlotAmount) {
  console.log(slotEntity.consult_duration);
  
    const update = await this.connection.query(`update shift_details set consult_duration = ? ,charge_id = ? where id = ?`,[
      slotEntity.consult_duration,slotEntity.charge_id,id
    ])
    // return update;
    return  [{"data ":{
      status:"success",
      "message":"tax_category details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM tax_category WHERE id = ?', [id])
    }}];
} catch (error) {
  return [
      {status:"failed",
"message":"cannot update tax_category module",
  }
  ]
}
  

async  remove(id: number) {
    const del = await this.connection.query('delete from shift_details where id = ?',[id])
    // return `This action removes a #${id} setupApptSlotAmount`;
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];

  }
}
