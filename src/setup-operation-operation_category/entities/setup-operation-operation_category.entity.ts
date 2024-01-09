import { Timestamp } from "typeorm";

export class SetupOperationOperationCategory {
    id:number;
    category:string;
    is_active:string;
    created_at:Timestamp;
    hospital_operation_category_id:number;
    Hospital_id:number;
}
