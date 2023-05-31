import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { PipesModule } from './pipes/pipes.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AttributeSelectorComponent } from './components/attribute-selector/attribute-selector.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductAttributeGroupService } from './service/product-attribute-group.service';
import { AttributeFilterComponent } from './components/attribute-filter/attribute-filter.component';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MatSelectModule } from '@angular/material/select';

const modules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    PortalModule,
    FuseDrawerModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
    DragDropModule,
    MtxDatetimepickerModule,
    MtxSelectModule,
    MtxNativeDatetimeModule,
    MatSelectModule
]

const components = [
    AttributeSelectorComponent,
    AttributeFilterComponent
]

@NgModule({
    imports: [...modules],
    exports: [...modules, ...components],
    declarations: [...components],
    providers: [ProductAttributeGroupService]
})
export class SharedModule { }
