import { Module } from '@nestjs/common';
import { SetupFindingsFindingService } from './setup-findings-finding.service';
import { SetupFindingsFindingController } from './setup-findings-finding.controller';

@Module({
  controllers: [SetupFindingsFindingController],
  providers: [SetupFindingsFindingService],
})
export class SetupFindingsFindingModule {}
