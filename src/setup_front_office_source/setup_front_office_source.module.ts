import { Module } from '@nestjs/common';
import { SetupFrontOfficeSourceService } from './setup_front_office_source.service';
import { SetupFrontOfficeSourceController } from './setup_front_office_source.controller';

@Module({
  controllers: [SetupFrontOfficeSourceController],
  providers: [SetupFrontOfficeSourceService],
})
export class SetupFrontOfficeSourceModule {}
