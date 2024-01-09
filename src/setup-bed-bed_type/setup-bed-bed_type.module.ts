import { Module } from '@nestjs/common';
import { SetupBedBedTypeService } from './setup-bed-bed_type.service';
import { SetupBedBedTypeController } from './setup-bed-bed_type.controller';

@Module({
  controllers: [SetupBedBedTypeController],
  providers: [SetupBedBedTypeService],
})
export class SetupBedBedTypeModule {}
