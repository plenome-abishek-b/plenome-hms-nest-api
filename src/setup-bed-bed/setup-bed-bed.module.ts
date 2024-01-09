import { Module } from '@nestjs/common';
import { SetupBedBedService } from './setup-bed-bed.service';
import { SetupBedBedController } from './setup-bed-bed.controller';

@Module({
  controllers: [SetupBedBedController],
  providers: [SetupBedBedService],
})
export class SetupBedBedModule {}
