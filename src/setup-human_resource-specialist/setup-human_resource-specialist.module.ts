import { Module } from '@nestjs/common';
import { SetupHumanResourceSpecialistService } from './setup-human_resource-specialist.service';
import { SetupHumanResourceSpecialistController } from './setup-human_resource-specialist.controller';

@Module({
  controllers: [SetupHumanResourceSpecialistController],
  providers: [SetupHumanResourceSpecialistService],
})
export class SetupHumanResourceSpecialistModule {}
