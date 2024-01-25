import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { OpdOutPatient } from './entities/opd-out_patient.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class OpdOutPatientService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){} 

  async create ( opd_entity:OpdOutPatient) {
    let dynamicConnection;
    try{

      const HOSpatient = await this.connection.query('select * from patients where id =?',[opd_entity.patient_id] )
  
      
      let HOspatientmobileno = HOSpatient[0].mobileno
  
  
    let  HOSTrimmedmobileno = HOspatientmobileno.startsWith('91') ? HOspatientmobileno.slice(2):HOspatientmobileno;

    const [HOSstaff] = await this.connection.query('select * from staff where id = ?',[opd_entity.cons_doctor])

    let HOSdoctoremail = HOSstaff.email

    console.log("zzzzzzzz",HOSdoctoremail)
    

  
      const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
  
        process.env.ADMIN_IP,
        process.env.ADMIN_DB_NAME,
        process.env.ADMIN_DB_PASSWORD,
        process.env.ADMIN_DB_USER_NAME
        )
      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     
      dynamicConnection  = await createConnection(dynamicConnectionOptions);
     
      const patientInHos = await dynamicConnection.query('select patients.id from patients where patients.mobileno = ? or patients.mobileno = ?',[
        HOspatientmobileno,HOSTrimmedmobileno
      ])
      console.log(patientInHos,"patientInHos");
      


            const [staffInHos] = await dynamicConnection.query('select staff.id from staff where staff.email = ?',[
            HOSdoctoremail
             ])
      
             console.log(staffInHos,"ssss");


     
        
let HOSpatientId;


if(patientInHos[0]){
  console.log("sssssddddd")
  HOSpatientId = patientInHos[0].id
  

}else{

  const datestring =  HOSpatient[0].dob;
  const dateObject = new Date(datestring);
  const Timestamp = dateObject.toISOString().replace('T',' ').replace(/\.\d+2$/,'');


 

  const createpatient = await dynamicConnection.query(`insert into patients  (
    patient_name,
    dob,
    image,
    mobileno,
    email,
    gender,
    address,
    ABHA_number
    )
    values(?,?,?,?,?,?,?,?)`,[
      HOSpatient[0].patient_name,
      HOSpatient[0].dob,
      HOSpatient[0].image,
      HOSpatient[0].mobile_no,
      HOSpatient[0].email,
      HOSpatient[0].gender,
      HOSpatient[0].address,
      HOSpatient[0].ABHA_number
    ])
    HOSpatientId = createpatient.insertId

  
}




var HOStransaction_id:number
const HOScaseRef = await this.connection.query('INSERT INTO case_references values(default,default)')
const HOSopdCreate = await this.connection.query(`
insert into opd_details (case_reference_id,patient_id) values (?,?)`,[
  HOScaseRef.insertId,
  opd_entity.patient_id
])




const [HOSamount] = await this.connection.query(`
select round((charges.standard_charge+(charges.standard_charge*((tax_category.percentage)/100))),2) amount from
charges join tax_category on charges.tax_category_id = tax_category.id
where charges.id = ?`,[opd_entity.patient_charge_id])

console.log(HOSamount);


const HOStransactions = await this.connection.query(`

insert into transactions (
  type,
  opd_id,
  section,
  patient_id,
  case_reference_id,
  amount,
  payment_mode,
  payment_date
  ) values
  (?,?,?,?,?,?,?,?)`,[
    'payment',
    HOSopdCreate.insertId,
    'OPD',
    opd_entity.opd_details_id,
    HOScaseRef.insertId,
    HOSamount.amount,
    opd_entity.payment_mode,
    opd_entity.payment_date,
    
  ])
  HOStransaction_id = HOStransactions.insertId
  console.log(HOStransaction_id,"idddddddddddddd");
  console.log(HOStransaction_id,"ccccccccc");


  const HOSvisitInsert = await this.connection.query(`
  insert into visit_details(
    opd_details_id,
    patient_charge_id,
    transaction_id,
    case_type,
    cons_doctor,
    appointment_date,
    live_consult,
    payment_mode
    ) values (?,?,?,?,?,?,?,?)`
    ,[
      HOSopdCreate.insertId,
      opd_entity.patient_charge_id,
      HOStransaction_id,
      "",
      opd_entity.cons_doctor,
      opd_entity.date+" "+opd_entity.time,
      opd_entity.live_consult,
      opd_entity.payment_mode
    ])
    console.log(HOSvisitInsert,"]][[]][[");
    
    const HOSvisit_details_id = HOSvisitInsert.insertId   

    console.log(HOSvisit_details_id,"HOSvisit_details_id");
    

  



// ##################################################################################################################################################################

  const caseRef = await dynamicConnection.query('INSERT INTO case_references values(default,default)')
  const opdCreate = await dynamicConnection.query(`
  insert into opd_details (case_reference_id,patient_id,Hospital_id,hos_opd_id) values (?,?,?,?)`,[
    caseRef.insertId,
    HOSpatientId,
    opd_entity.Hospital_id,
    HOSopdCreate.insertId
  ])
   console.log(opdCreate.insertId,"opdCreate111111111111111");
   let insertOPDID = opdCreate.insertId



 

const [charges] = await dynamicConnection.query(`select * from charges where Hospital_id = ? and hospital_charges_id = ?`,
[opd_entity.Hospital_id,
  opd_entity.patient_charge_id
])
console.log("Hospital ID:", opd_entity.Hospital_id);
console.log("Patient Charge ID:", opd_entity.patient_charge_id);
console.log(charges,"xxxxxxxx");

 


  
   
let adminTransacction_id;
  const transactions = await dynamicConnection.query(`
  insert into transactions (
  type,
  opd_id,
  section,
  patient_id,
  case_reference_id,
  amount,
  payment_mode,
  payment_date,Hospital_id,
  hos_transaction_id
  ) values
  (?,?,?,?,?,?,?,?,?,?)`,[
    'payment',
    insertOPDID,
    'OPD',
    HOSpatientId,
    caseRef.insertId,
    HOSamount.amount,
    opd_entity.payment_mode,
    opd_entity.payment_date,
    opd_entity.Hospital_id,
    HOStransactions.insertId
  ])
  adminTransacction_id = transactions.insertId
  console.log(adminTransacction_id,"11221121122112");
   
 

  const visitInsert = await dynamicConnection.query(`
  insert into visit_details(
    opd_details_id,
    patient_charge_id,
    transaction_id,
    case_type,
    cons_doctor,
    appointment_date,
    live_consult,
    payment_mode,
    Hospital_id,
    hos_visit_id
  ) values (?,?,?,?,?,?,?,?,?,?)`,

  [
    opdCreate.insertId,
    charges.id,
    adminTransacction_id,
    "",
    opd_entity.cons_doctor,
    opd_entity.date+" "+opd_entity.time,
    opd_entity.live_consult,
    opd_entity.payment_mode,
    opd_entity.Hospital_id,
    HOSvisitInsert.insertId
  ]
  )
    


 await dynamicConnection.close();

return [{
  "status":"success",
  "message":"opd details added successfully",
  //  "inserted_details ":await this.connection.query('select * from opd_details where id = ?', )
}];
    }

catch (error) {  
  if(dynamicConnection){
    await dynamicConnection.close();
    return error
  
} 
}

}


async findAll() {

  const opd_details = await this.connection.query(`SELECT distinct
  patients.patient_name,
  patients.id,
  patients.guardian_name,
  patients.mobileno,
  (SELECT COUNT(*) FROM opd_details WHERE patients.id = opd_details.patient_id) AS totalrecheckup,
  (SELECT  visit_details.appointment_date 
   FROM visit_details 
   JOIN staff ON staff.id = visit_details.cons_doctor 
   ORDER BY visit_details.appointment_date DESC LIMIT 1
  ) AS last_consultation,
  (SELECT  concat(staff.name," ",staff.surname,"(",staff.employee_id,")") 
   FROM visit_details 
   JOIN staff ON staff.id = visit_details.cons_doctor 
   ORDER BY visit_details.appointment_date DESC LIMIT 1
  ) AS doctor
FROM
  opd_details
LEFT JOIN visit_details ON visit_details.opd_details_id = opd_details.id
LEFT JOIN staff ON staff.id = visit_details.cons_doctor
LEFT JOIN patients ON patients.id = opd_details.patient_id`);
  return opd_details;

}

async findOne(search: string) {
  let query = `SELECT distinct
  patients.patient_name,
  patients.id,
  patients.guardian_name,
  patients.mobileno,
  (SELECT COUNT(*) FROM opd_details WHERE patients.id = opd_details.patient_id) AS totalrecheckup,
  (SELECT  visit_details.appointment_date 
   FROM visit_details 
   JOIN staff ON staff.id = visit_details.cons_doctor 
   ORDER BY visit_details.appointment_date DESC LIMIT 1
  ) AS last_consultation,
  (SELECT  concat(staff.name," ",staff.surname,"(",staff.employee_id,")") 
   FROM visit_details 
   JOIN staff ON staff.id = visit_details.cons_doctor 
   ORDER BY visit_details.appointment_date DESC LIMIT 1
  ) AS doctor
FROM
  opd_details
LEFT JOIN visit_details ON visit_details.opd_details_id = opd_details.id
LEFT JOIN staff ON staff.id = visit_details.cons_doctor
LEFT JOIN patients ON patients.id = opd_details.patient_id `
let values = []
if(search){
 query += ` where patients.patient_name like ? or staff.name like ? or patients.guardian_name like ? or patients.gender like ? or patients.mobileno like ? `
 values.push("%"+search+"%")
 values.push("%"+search+"%")
 values.push("%"+search+"%")
 values.push("%"+search+"%")
 values.push("%"+search+"%")

}
console.log(values,"qqqq");

  const opd_details = await this.connection.query(query,values);
  
    return opd_details 
 
  }




    






  catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update opd profile",
       "error":error
    }
    ]
  }
}

