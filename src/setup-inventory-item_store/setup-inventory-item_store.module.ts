import { Module } from '@nestjs/common';
import { SetupInventoryItemStoreService } from './setup-inventory-item_store.service';
import { SetupInventoryItemStoreController } from './setup-inventory-item_store.controller';

@Module({
  controllers: [SetupInventoryItemStoreController],
  providers: [SetupInventoryItemStoreService],
})
export class SetupInventoryItemStoreModule {}
