import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { UserSettingsTypes } from 'app/core/config/app.config';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { IntegrationListResponse } from 'app/modules/admin/integrations/integration.types';
import { ProductGroupsService } from 'app/modules/settings/product-groups/product-groups.service';
import { ProductGroupsResponse } from 'app/modules/settings/product-groups/product-groups.types';
import { ProductAttributeGroupService } from 'app/shared/service/product-attribute-group.service';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { OrderListResponse } from './orders/order.type';
import { ProductsService } from './products/products.service';
import { ProductAttributeListResponse } from './products/products.types';
import { SyncLogsService } from './sync-logs.service';
import { SyncLog } from './sync-logs.types';

@Injectable({
    providedIn: 'root',
})
export class SyncLogsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _syncLogsService: SyncLogsService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<EcommifyApiResponse<OrderListResponse>> {
        return this._syncLogsService.getSyncLogOrders(0, 25, 'created_at', 'desc');
    }
}
@Injectable({
    providedIn: 'root',
})
export class SyncLogsProductsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _syncLogsService: SyncLogsService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<{
        pagination: Pagination;
        syncLogs: SyncLog[];
    }> {
        return this._syncLogsService.getSyncLogProducts();
    }
}


@Injectable({
    providedIn: 'root',
})
export class SyncLogsUserSettingResolver implements Resolve<any> {

    constructor(private _productService: ProductsService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._productService.getUserSettings({ type: UserSettingsTypes.product_view });
    }
}

@Injectable({
    providedIn: 'root',
})
export class ProductAttributeListResolver implements Resolve<any> {

    constructor(private _productAttributeGroupService: ProductAttributeGroupService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<EcommifyApiResponse<ProductAttributeListResponse>[]> {
        return forkJoin(
            this._productAttributeGroupService.getUserDefinedProductAttributes(0, 1000, {
                filters: [{
                    "field": "type",
                    "operator": "!eq",
                    "value": "completeness"
                }]
            }).pipe(catchError(error => { return of(null) })),
            this._productAttributeGroupService.getSystemDefinedProductAttributes().pipe(catchError(error => { return of(null) })),
            this._productAttributeGroupService.getIntegrationDefinedProductAttributes().pipe(catchError(error => { return of(null) }))
        )
        // return this._productService.getProductAttributes(0, 1000, {});
    }
}
