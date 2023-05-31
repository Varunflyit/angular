import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationResolver } from 'app/modules/settings/integrations/integration.resolver';
import { ProductGroupsResolver } from 'app/modules/settings/product-groups/product-groups.resolvers';
import { SyncLogsOrdersComponent } from './orders/orders.component';
import { SyncLogsProductDetailsComponent } from './product-details/product-details.component';
import { SyncLogsProductsComponent } from './products/products.component';
import {
    ProductAttributeListResolver,
    SyncLogsUserSettingResolver,
    SyncLogsResolver,
} from './sync-logs.resolvers';
const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'orders',
    },
    {
        path: 'orders',
        component: SyncLogsOrdersComponent,
        resolve: {
            syncLogs: SyncLogsResolver,
            integrations: IntegrationResolver,
        },
    },
    {
        path: 'products',
        component: SyncLogsProductsComponent,
        resolve: {
            setting: SyncLogsUserSettingResolver,
            attributeList: ProductAttributeListResolver,
            groupList: ProductGroupsResolver
        },
    },
    {
        path: 'products/:id',
        component: SyncLogsProductDetailsComponent,
        resolve: {
            setting: SyncLogsUserSettingResolver,
            attributeList: ProductAttributeListResolver
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SyncLogsRoutingModule { }
