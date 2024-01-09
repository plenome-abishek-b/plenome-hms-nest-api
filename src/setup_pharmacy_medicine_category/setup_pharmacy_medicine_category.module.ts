


import { Module } from '@nestjs/common';
import { MedicineCategoryController } from './setup_pharmacy_medicine_category.controller';
import { MedicineCategoryService } from './setup_pharmacy_medicine_category.service';

@Module({
  controllers: [MedicineCategoryController],
  providers: [MedicineCategoryService],
})
export class MedicineCategoryModule {}