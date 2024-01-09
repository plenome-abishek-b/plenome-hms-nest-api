import { Module } from '@nestjs/common';
import { SetupInventoryItemSupplierService } from './setup-inventory-item_supplier.service';
import { SetupInventoryItemSupplierController } from './setup-inventory-item_supplier.controller';

@Module({
  controllers: [SetupInventoryItemSupplierController],
  providers: [SetupInventoryItemSupplierService],
})
export class SetupInventoryItemSupplierModule {}
