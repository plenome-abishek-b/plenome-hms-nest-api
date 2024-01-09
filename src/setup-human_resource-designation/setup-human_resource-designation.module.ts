import { Module } from '@nestjs/common';
import { SetupHumanResourceDesignationService } from './setup-human_resource-designation.service';
import { SetupHumanResourceDesignationController } from './setup-human_resource-designation.controller';

@Module({
  controllers: [SetupHumanResourceDesignationController],
  providers: [SetupHumanResourceDesignationService],
})
export class SetupHumanResourceDesignationModule {}
