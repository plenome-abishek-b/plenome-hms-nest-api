import { Module } from '@nestjs/common';
import { SetupFrontOfficePurposeService } from './setup_front_office_purpose.service';
import { SetupFrontOfficePurposeController } from './setup_front_office_purpose.controller';

@Module({
  controllers: [SetupFrontOfficePurposeController],
  providers: [SetupFrontOfficePurposeService],
})
export class SetupFrontOfficePurposeModule {}
