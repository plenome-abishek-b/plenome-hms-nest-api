import { Module } from '@nestjs/common';
import { SetupOperationOperationService } from './setup-operation-operation.service';
import { SetupOperationOperationController } from './setup-operation-operation.controller';

@Module({
  controllers: [SetupOperationOperationController],
  providers: [SetupOperationOperationService],
})
export class SetupOperationOperationModule {}
