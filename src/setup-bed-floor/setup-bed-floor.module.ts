import { Module } from '@nestjs/common';
import { SetupBedFloorService } from './setup-bed-floor.service';
import { SetupBedFloorController } from './setup-bed-floor.controller';

@Module({
  controllers: [SetupBedFloorController],
  providers: [SetupBedFloorService],
})
export class SetupBedFloorModule {}
