import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegrationStatusResolver } from './integration-status/integration-status.resolvers';
import { IntegrationStatusComponent } from './integration-status/integration-status.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'integration-status',
  },
  {
    path: 'integration-status',
    component: IntegrationStatusComponent,
    resolve: {
      integrationStatusResponse: IntegrationStatusResolver,
    },
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
