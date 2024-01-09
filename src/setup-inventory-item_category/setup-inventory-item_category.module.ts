import { Module } from '@nestjs/common';
import { SetupInventoryItemCategoryService } from './setup-inventory-item_category.service';
import { SetupInventoryItemCategoryController } from './setup-inventory-item_category.controller';

@Module({
  controllers: [SetupInventoryItemCategoryController],
  providers: [SetupInventoryItemCategoryService],
})
export class SetupInventoryItemCategoryModule {}
