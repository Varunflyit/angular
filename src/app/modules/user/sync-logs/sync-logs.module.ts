// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { SyncLogsRoutingModule } from './sync-logs-routing.module';
// import { OrdersComponent } from './orders/orders.component';
// import { ProductsComponent } from './products/products.component';

// @NgModule({
//   declarations: [
//     OrdersComponent,
//     ProductsComponent
//   ],
//   imports: [
//     CommonModule,
//     SyncLogsRoutingModule
//   ]
// })
// export class SyncLogsModule { }
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SyncLogsRoutingModule } from './sync-logs-routing.module';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTreeModule } from '@angular/material/tree';
import { SharedModule } from 'app/shared/shared.module';
import { MtxSelectModule } from '@ng-matero/extensions/select';

import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsProductsComponent } from './products/products.component';
import { ViewOrderDetailsComponent } from './orders/view-order-details/view-order-details.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RelationshipFilterComponent } from './relationship-filter/relationship-filter.component';
import { SelectSkuModalComponent } from './select-sku-modal/select-sku-modal.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ResizableModule } from 'angular-resizable-element';
import { BulkEditModalComponent } from './bulk-edit-modal/bulk-edit-modal.component';
import { BulkAttributesComponent } from './bulk-attributes/bulk-attributes.component';
import { BulkRelationshipsComponent } from './bulk-relationships/bulk-relationships.component';
import { BulkFindReplaceComponent } from './bulk-find-replace/bulk-find-replace.component';
import { BulkCategoriesComponent } from './bulk-categories/bulk-categories.component';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { GroupFilterComponent } from './group-filter/group-filter.component';
import { IntegrationTitleFilterComponent } from './integration-title-filter/integration-title-filter.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { OrderStatusFilterComponent } from './order-status-filter/order-status-filter.component';
import { OrderLifecycleFilterComponent } from './order-lifecycle-filter/order-lifecycle-filter.component';
import { OrderActionFilterComponent } from './order-action-filter/order-action-filter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductEditColumnModalComponent } from './product-edit-column-modal/product-edit-column-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SyncLogsProductDetailsComponent } from './product-details/product-details.component';
import { QuillModule } from 'ngx-quill';
import { DeleteProductModalComponent } from './delete-product-modal/delete-product-modal.component'
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';

import { ResizeColumnDirective } from './products/resize-column.directive';
import { ProductExportModalComponent } from './product-export-modal/product-export-modal.component';

@NgModule({
    declarations: [
        SyncLogsOrdersComponent,
        SyncLogsProductsComponent,
        ViewOrderDetailsComponent,
        RelationshipFilterComponent,
        SelectSkuModalComponent,
        ImagePreviewComponent,
        BulkEditModalComponent,
        BulkAttributesComponent,
        BulkRelationshipsComponent,
        BulkFindReplaceComponent,
        BulkCategoriesComponent,
        GroupFilterComponent,
        IntegrationTitleFilterComponent,
        DateFilterComponent,
        OrderStatusFilterComponent,
        OrderLifecycleFilterComponent,
        OrderActionFilterComponent,
        ProductEditColumnModalComponent,
        SyncLogsProductDetailsComponent,
        DeleteProductModalComponent,
        ResizeColumnDirective,
        ProductExportModalComponent
    ],
    imports: [
        MatButtonModule,
        SyncLogsRoutingModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
        MtxDatetimepickerModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatTableModule,
        MatAutocompleteModule,
        ResizableModule,
        MatTreeModule,
        MtxPopoverModule,
        MtxSelectModule,
        DragDropModule,
        MatExpansionModule,
        MtxNativeDatetimeModule,
        QuillModule.forRoot()
    ],
    providers: [
        MatDatepickerModule,
        DatePipe
    ]
})
export class SyncLogsModule { }
