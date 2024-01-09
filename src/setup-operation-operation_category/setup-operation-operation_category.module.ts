import { Module } from '@nestjs/common';
import { SetupOperationOperationCategoryService } from './setup-operation-operation_category.service';
import { SetupOperationOperationCategoryController } from './setup-operation-operation_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // imports:[ TypeOrmModule.forFeature([FindingsCategory])],

  controllers: [SetupOperationOperationCategoryController],
  providers: [SetupOperationOperationCategoryService],
})
export class SetupOperationOperationCategoryModule {}
