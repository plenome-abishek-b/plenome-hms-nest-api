import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupHospitalChargesChargeTypeModule } from './entities/setup-hospital-charges_charge_type_module.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { CharsetToEncoding } from 'mysql2';

@Injectable()
export class SetupHospitalChargesChargeTypeModuleService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}

  async create(charge_type_moduleEntity: SetupHospitalChargesChargeTypeModule ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection
   try{
    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
      dynamicConnection = await createConnection(dynamicConnectionOptions);
 
const [check] = await this.connection.query(`select id from charge_type_module where charge_type_master_id = ? and module_shortcode =?`,[
  charge_type_moduleEntity.charge_type_master_id, charge_type_moduleEntity.module_shortcode
])
if(check ){
const [getadmin] = await dynamicConnection.query(`select id from charge_type_module where Hospital_id =? and hospital_charge_type_module_id = ?`,[
  charge_type_moduleEntity.Hospital_id,check.id
])

const deladmin = await dynamicConnection.query(`delete from charge_type_module where id = ?`,[getadmin.id])
const del = await this.connection.query(`delete from charge_type_module where id = ?`,[check.id])
return [{"data":{
  "status":"success",
  "message":"charge_type_module details deleted successfully",
}}]

}else{
    const result = await this.connection.query(
      'INSERT INTO charge_type_module (charge_type_master_id,module_shortcode) VALUES (?,?)',
      [charge_type_moduleEntity.charge_type_master_id,
        charge_type_moduleEntity.module_shortcode,
       
      ]
    );

    const [getAdminMaster] = await dynamicConnection.query(`select id from charge_type_master where
     hospital_charge_type_master_id = ? and
     Hospital_id = ?
    `,[
      charge_type_moduleEntity.charge_type_master_id,
      charge_type_moduleEntity.Hospital_id
    ])
    
    const AdminCategory = await dynamicConnection.query('INSERT INTO charge_type_module (charge_type_master_id,module_shortcode,Hospital_id,hospital_charge_type_module_id) VALUES (?,?,?,?)',[
      getAdminMaster.id,
      charge_type_moduleEntity.module_shortcode,
      charge_type_moduleEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
              await dynamicConnection.close();
   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"charge_type_module details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM charge_type_module WHERE id = ?', [result.insertId])
              }}];
            }

  } catch(error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }


  async findAll(): Promise<SetupHospitalChargesChargeTypeModuleService[]> {
    // let q = `
    //   SELECT
    //     charge_type_master.id,
    //     charge_type_master.charge_type AS charge_type,
    //     JSON_ARRAYAGG(
    //       JSON_OBJECT('module_shortcode', charge_type_module.module_shortcode)
    //     ) AS modules
    //   FROM charge_type_module
    //   JOIN charge_type_master ON charge_type_module.charge_type_master_id = charge_type_master.id
    //   GROUP BY charge_type_master.id
    // `;
    let q = `
    SELECT
    charge_type_master.id,
    charge_type_master.charge_type AS charge_type,
    JSON_ARRAYAGG(
        JSON_OBJECT('module_shortcode', charge_type_module.module_shortcode)
    ) AS modules
FROM charge_type_master
LEFT JOIN charge_type_module ON charge_type_module.charge_type_master_id = charge_type_master.id
GROUP BY charge_type_master.id;
  `;
 
    const charge_type_modules = await this.connection.query(q);
 
    // Transform the result to return an array of objects
    // const formattedResults = charge_type_modules.map(chargeTypeModule => {
    //   return {
    //     id: chargeTypeModule.id,
    //     charge_type: chargeTypeModule.charge_type,
    //     modules: JSON.parse(chargeTypeModule.modules),
    //   };
    // });
    const predefinedModules = ['appointment','ipd', 'opd', 'pathology', 'radiology', 'bloodbank', 'ambulance'];
    const mapModules = (modules) => {
      return predefinedModules.reduce((acc, moduleName) => {
        acc[moduleName] = modules.some(module => module.module_shortcode === moduleName);
        return acc;
      }, {});
    };
   
   
    // Transform the result to return an array of objects
    const formattedResults = charge_type_modules.map(chargeTypeModule => {
      return {
        id: chargeTypeModule.id,
        charge_type: chargeTypeModule.charge_type,
        modules: Array.isArray(chargeTypeModule.modules)
        ? mapModules(chargeTypeModule.modules)
        : {},
      };
    });
    // console.log(formattedResults,"shhhh");
    //  console.log(formattedResults,"loging data");
     
    return formattedResults;
  }



  async findone(dokku:number): Promise<SetupHospitalChargesChargeTypeModuleService[]> {
    let q = `select distinct charge_type_master.id,
    charge_type_master.charge_type as charge_type,
    group_concat(distinct concat(charge_type_module.module_shortcode) separator',') as module_shortcode
    from charge_type_module
    join charge_type_master ON charge_type_module.charge_type_master_id = charge_type_master.id
    where charge_type_module.charge_type_master_id = ?
    group by charge_type_master.id `
    console.log(q);
    
    const charge_type_module = await this.connection.query(q, [dokku]);
    return charge_type_module ;
  }

  




      

}
