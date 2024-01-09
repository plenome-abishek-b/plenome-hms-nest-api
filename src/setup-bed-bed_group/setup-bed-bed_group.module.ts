import { Module } from '@nestjs/common';
import { SetupBedBedGroupService } from './setup-bed-bed_group.service';
import { SetupBedBedGroupController } from './setup-bed-bed_group.controller';

@Module({
  controllers: [SetupBedBedGroupController],
  providers: [SetupBedBedGroupService],
})
export class SetupBedBedGroupModule {}
