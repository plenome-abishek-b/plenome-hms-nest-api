import { Module } from '@nestjs/common';
import { SetupHumanResourceDepartmentService } from './setup-human_resource-department.service';
import { SetupHumanResourceDepartmentController } from './setup-human_resource-department.controller';

@Module({
  controllers: [SetupHumanResourceDepartmentController],
  providers: [SetupHumanResourceDepartmentService],
})
export class SetupHumanResourceDepartmentModule {}
