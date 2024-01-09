import { Module } from '@nestjs/common';
import { SetupHumanResourceLeaveTypesService } from './setup-human_resource-leave_types.service';
import { SetupHumanResourceLeaveTypesController } from './setup-human_resource-leave_types.controller';

@Module({
  controllers: [SetupHumanResourceLeaveTypesController],
  providers: [SetupHumanResourceLeaveTypesService],
})
export class SetupHumanResourceLeaveTypesModule {}
