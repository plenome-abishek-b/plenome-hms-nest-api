import { Module } from '@nestjs/common';
import { SetupFrontOfficeComplainTypeService } from './setup_front_office_complain_type.service';
import { SetupFrontOfficeComplainTypeController } from './setup_front_office_complain_type.controller';

@Module({
  controllers: [SetupFrontOfficeComplainTypeController],
  providers: [SetupFrontOfficeComplainTypeService],
})
export class SetupFrontOfficeComplainTypeModule {}
