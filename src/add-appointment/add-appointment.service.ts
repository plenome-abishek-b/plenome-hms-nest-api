import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { AddAppointment } from './entities/add-appointment.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
 
@Injectable()
export class AddAppointmentService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}
 
  async  create(AppointmentEntity: AddAppointment) {
    let dynamicConnection;
    try {
     
    // const privateKey = await this.generatePublicKey();
 
    const HOSpatient = await this.connection.query('select * from patients where id =?',[AppointmentEntity.patient_id] )
    console.log(HOSpatient,".........");
 
    let HOspatientmobileno = HOSpatient[0].mobileno
    console.log(HOspatientmobileno,"ssssss");
 
    // let HOSTrimmedmobileno;
console.log(HOspatientmobileno.length,"rrrrrrrr")
 
    // if(HOSTrimmedmobileno.length > 10) {
  let  HOSTrimmedmobileno = HOspatientmobileno.startsWith('91') ? HOspatientmobileno.slice(2):HOspatientmobileno;
    console.log(HOSpatient[0].mobile_no,"HOS");
  // }
 
  //   else
  //   {
  //     HOSTrimmedmobileno = HOspatientmobileno;
  //   }
   
    console.log(HOspatientmobileno,"aaaa");
 
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
   
let HOSpatientId;
 
 
if(patientInHos[0]){
  console.log("entering If");
 
  HOSpatientId = patientInHos[0].id
  console.log(HOSpatientId,"11221122");
 
 
}else{
  console.log("entering else");
 
  const datestring =  HOSpatient[0].dob;
  const dateObject = new Date(datestring);
  const Timestamp = dateObject.toISOString().replace('T',' ').replace(/\.\d+2$/,'');
 
  console.log(Timestamp,"ddddd");
 
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
    console.log(HOSpatientId,"==--==--");
 
 
}
   
 
    var HOStransaction_id:number
    const HOScaseRef = await this.connection.query('INSERT INTO case_references values(default,default)')
    const HOSopdCreate = await this.connection.query(`
    insert into opd_details (case_reference_id,patient_id) values (?,?)`,[
      HOScaseRef.insertId,
      AppointmentEntity.patient_id
    ])
    const HOScharge = await this.connection.query('select charge_id from shift_details where shift_details.staff_id = ?',
    [AppointmentEntity.doctor])
    console.log(HOScharge,"..............");
   
    let HOScharge_id = HOScharge[0].charge_id
    // console.log(charge_id,"charge");
   
   
    const HOSamount = await this.connection.query(`
    select round((charges.standard_charge+(charges.standard_charge*((tax_category.percentage)/100))),2) amount from
    charges join tax_category on charges.tax_category_id = tax_category.id
  where charges.id = ?`,[HOScharge_id])
   
  // console.log(amount,"amount");
   
 
  const HOStransactions = await this.connection.query(`
  insert into transactions (
    type,
    section,
    patient_id,
    case_reference_id,
    amount,
    payment_mode,
    payment_date
    ) values
    (?,?,?,?,?,?,?)`,[
      'payment',
      'Appointment',
      AppointmentEntity.patient_id,
      HOScaseRef.insertId,
      HOSamount[0].amount,
      AppointmentEntity.payment_mode,
      AppointmentEntity.payment_date,
     
    ])
    HOStransaction_id = HOStransactions.insertId
    console.log(HOStransaction_id,"idddddddddddddd");
   
 
   
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
        HOScharge_id,
        HOStransaction_id,
        "",
        AppointmentEntity.doctor,
        AppointmentEntity.date+" "+AppointmentEntity.time,
        AppointmentEntity.live_consult,
        AppointmentEntity.payment_mode
      ])
  const HOSvisit_details_id = HOSvisitInsert.insertId  
 
  let hos_appointment_id ;
  // console.log("11111",hos_appointment_id);
   
      const HOSbookAppnt = await this.connection.query(
        `insert into appointment(
          patient_id,
          case_reference_id,
          visit_details_id,
          date,
          time,
          doctor,
          source,
          global_shift_id,
          shift_id,
          live_consult,
          amount
         
          ) values(?,?,?,?,?,?,?,?,?,?,?)`,[
            AppointmentEntity.patient_id,
            HOScaseRef.insertId,
            HOSvisitInsert.insertId,
            AppointmentEntity.date,
            AppointmentEntity.time,
            AppointmentEntity.doctor,
            'Online',
            AppointmentEntity.global_shift_id,
            AppointmentEntity.shift_id,
            AppointmentEntity.live_consult,
            HOSamount[0].amount
          ]
      )
 
       hos_appointment_id = HOSbookAppnt.insertId
   
      if(HOStransaction_id){
  const HOSupdatetxn = await this.connection.query(`update transactions set transactions.appointment_id = ? where transactions.id = ?`,[
    HOSbookAppnt.insertId,
    HOStransaction_id
  ])      
      }
     
   
  // #############################################################################################################
   
  var transaction_id:number
  const caseRef = await dynamicConnection.query('INSERT INTO case_references values(default,default)')
  const opdCreate = await dynamicConnection.query(`
  insert into opd_details (case_reference_id,patient_id,Hospital_id) values (?,?,?)`,[
    caseRef.insertId,
    HOSpatientId,
    AppointmentEntity.Hospital_id
  ])
   
   
  // console.log(amount,"amount");
   try{
 
  const transactions = await dynamicConnection.query(`
  insert into transactions (
  type,
  section,
  patient_id,
  case_reference_id,
  amount,
  payment_mode,
  payment_date,Hospital_id
  ) values
  (?,?,?,?,?,?,?,?)`,[
    'payment',
    'Appointment',
    HOSpatientId,
    caseRef.insertId,
    HOSamount[0].amount,
    AppointmentEntity.payment_mode,
    AppointmentEntity.payment_date,
    AppointmentEntity.Hospital_id
  ])
  transaction_id = transactions.insertId
  console.log(transaction_id,"idddddddddddddd");
   
  } catch (error) {
    return "error in admin transaction insert"
  }
   
  const visitInsert = await dynamicConnection.query(`
  insert into visit_details(
    opd_details_id,
    patient_charge_id,
    transaction_id,
    case_type,
    cons_doctor,
    appointment_date,
    live_consult,
    payment_mode,Hospital_id
    ) values (?,?,?,?,?,?,?,?,?)`
    ,[
      opdCreate.insertId,
      HOScharge_id,
      transaction_id,
      "",
      AppointmentEntity.doctor,
      AppointmentEntity.date+" "+AppointmentEntity.time,
      AppointmentEntity.live_consult,
      AppointmentEntity.payment_mode,
      AppointmentEntity.Hospital_id
    ])
  const visit_details_id = visitInsert.insertId    
//
  console.log(hos_appointment_id,"wwwwww");
   
    const bookAppnt = await dynamicConnection.query(
      `insert into appointment(
        patient_id,
        case_reference_id,
        visit_details_id,
        date,
        time,
        doctor,
        source,
        global_shift_id,
        shift_id,
        live_consult,
        Hospital_id,hos_appointment_id,
        amount
        ) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`,[
          HOSpatientId,
          caseRef.insertId,
          visitInsert.insertId,
          AppointmentEntity.date,
          AppointmentEntity.time,
          AppointmentEntity.doctor,
          'Online',
          AppointmentEntity.global_shift_id,
          AppointmentEntity.shift_id,
          AppointmentEntity.live_consult,
          AppointmentEntity.Hospital_id,
          hos_appointment_id,
          HOSamount[0].amount
        ]
    )
 
   console.log(hos_appointment_id,"dddddd")
    if(transaction_id){
  const updatetxn = await dynamicConnection.query(`update transactions set transactions.appointment_id = ? where transactions.id = ?`,[
  bookAppnt.insertId,
  transaction_id
  ])      
    }
      await dynamicConnection.close();
 
   
    console.log("eeeeeeee")
 
      return [{
        "status":"success",
        "messege":"Appointment booked successfully",
        "inserted_details":await this.connection.query('select * from appointment where id = ?',[HOSbookAppnt.insertId])
      }];
   
    } catch (error) {
      if(dynamicConnection){
        await dynamicConnection.close();
        return error
      }
    }
  }
   
 
 
 
 
 
 
 
async findAll(): Promise<AddAppointment[]> {
 
  const appointment = await this.connection.query(`select appointment.id,patients.patient_name,concat('APPN','',appointment.id) as appointment_no, appointment.date,patients.mobileno,patients.gender,
  CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,appointment.source,appoint_priority.priority_status,appointment.live_consult,
  appointment.appointment_status,appointment.amount from appointment
  join patients ON appointment.patient_id = patients.id
  left join staff ON appointment.doctor = staff.id
  left join appoint_priority ON appointment.priority = appoint_priority.id
  left join transactions ON appointment.amount = transactions.id`);
  return appointment ;
}
 
async findOne(id: string): Promise<AddAppointment | null> {
  const appointment = await this.connection.query(`select appointment.id,patients.patient_name,concat('APPN','',appointment.id) as appointment_no, appointment.date,patients.mobileno,patients.gender,
  CONCAT( staff.name, ' ', staff.surname,((staff.employee_id))) AS doctor_name,appointment.source,appoint_priority.priority_status,appointment.live_consult,
  appointment.appointment_status,appointment.amount from appointment
  join patients ON appointment.patient_id = patients.id
  left join staff ON appointment.doctor = staff.id
  left join appoint_priority ON appointment.priority = appoint_priority.id
  left join transactions ON appointment.amount = transactions.id WHERE appointment.id = ?`, [id]);
 
  if (appointment.length === 1) {
    return appointment
  } else {
    return null;
  }
}
 
 
 
async update(id: string, AddAppointmentEntity: AddAppointment): Promise<{ [key: string]: any }[]> {
 
  try {
   
   
    const result = await this.connection.query(
      'UPDATE appointment SET category =? WHERE id = ?',
      [AddAppointmentEntity.patient_id,
        AddAppointmentEntity.case_reference_id,
        AddAppointmentEntity.visit_details_id,
        AddAppointmentEntity.date,
        AddAppointmentEntity.time,
        AddAppointmentEntity.priority,
        AddAppointmentEntity.specialist,
        AddAppointmentEntity.doctor,
        AddAppointmentEntity.amount,
        AddAppointmentEntity.message,
        AddAppointmentEntity.appointment_status,
        AddAppointmentEntity.source,
        AddAppointmentEntity.is_opd,
        AddAppointmentEntity.is_ipd,
        AddAppointmentEntity.global_shift_id,
        AddAppointmentEntity.shift_id,
        AddAppointmentEntity.is_queue,
        AddAppointmentEntity.live_consult,
        AddAppointmentEntity.Hospital_id,
       id
      ]
    );
console.log("kkkkkkkk");
 
const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(
 
  process.env.ADMIN_IP,
  process.env.ADMIN_DB_NAME,
  process.env.ADMIN_DB_PASSWORD,
  process.env.ADMIN_DB_USER_NAME
  )
 
const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
const dynamicConnection = await createConnection(dynamicConnectionOptions);
 
const repo =  await dynamicConnection.query(
'update appointment SET patient_id = ?,case_reference_id = ?,visit_details_id=?,date =?,time=?, priority=?,specialist=?, doctor=?,  amount=?, message=?,  appointment_status=?, source=?,is_opd=?,is_ipd=?,global_shift_id=?,shift_id=?, is_queue=?, live_consult=?, where Hospital_id= ?',
 
[AddAppointmentEntity.patient_id,
  AddAppointmentEntity.case_reference_id,
  AddAppointmentEntity.visit_details_id,
  AddAppointmentEntity.date,
  AddAppointmentEntity.time,
  AddAppointmentEntity.priority,
  AddAppointmentEntity.specialist,
  AddAppointmentEntity.doctor,
  AddAppointmentEntity.amount,
  AddAppointmentEntity.message,
  AddAppointmentEntity.appointment_status,
  AddAppointmentEntity.source,
  AddAppointmentEntity.is_opd,
  AddAppointmentEntity.is_ipd,
  AddAppointmentEntity.global_shift_id,
  AddAppointmentEntity.shift_id,
  AddAppointmentEntity.is_queue,
  AddAppointmentEntity.live_consult,
  id,
  AddAppointmentEntity.Hospital_id
]
 
);
 
console.log("12345");
 
 
 
    return  [{"data ":{
    status:"success",
    "messege":"appointment details updated successfully ",
    "updated_values":await this.connection.query('SELECT * FROM appointment WHERE id = ?', [id])
    }}];
  } catch (error) {
    return [
      {status:"failed",
       "messege":"cannot update appointment profile",
       "error":error
    }
    ]
  }
}
 
async remove(id: string): Promise<{ [key: string]: any }[]> {
  const result = await this.connection.query('DELETE FROM appointment WHERE id = ?', [id]);
  return [{
    "status":"success",
    "message":" id: "+ id+" deleted successfully"
  }
  ];
}
 
}