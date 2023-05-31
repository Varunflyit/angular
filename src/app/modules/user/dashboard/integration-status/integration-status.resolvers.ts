import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { Observable } from 'rxjs';
import { IntegrationStatusService } from './integration-status.service';
import { IntegrationStatusResponse } from './integration-status.types';

@Injectable({
    providedIn: 'root',
})
export class IntegrationStatusResolver implements Resolve<any> {
    constructor(private _integrationStatusService: IntegrationStatusService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     * @param route, * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<EcommifyApiResponse<IntegrationStatusResponse[]>> {
        return this._integrationStatusService.getIntegrationStatusDashboardData();
    }
}
