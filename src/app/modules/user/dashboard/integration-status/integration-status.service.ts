import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    Observable,
    of,
    tap
} from 'rxjs';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { IntegrationStatusResponse } from './integration-status.types';
import { appConfig } from 'app/core/config/app.config';
import { EcommifyApiResponse } from 'app/core/api/api.types';

import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { GridUtils } from '../../../../layout/common/grid/grid.utils';

@Injectable({
    providedIn: 'root',
})
export class IntegrationStatusService {
    // Private
    private _config = appConfig;
    private _integrationStatusData: BehaviorSubject<IntegrationStatusResponse[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }


    // Getter for Integration Status Dashboard
    get IntegrationStatusData$(): Observable<IntegrationStatusResponse[]> {
        return this._integrationStatusData.asObservable();
    }

    // Getter for pagination
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get IntegrationStatus Dashboard Data
     * @param page , @param size, @param sort, @param order, @param search // TBD
     */
    getIntegrationStatusDashboardData(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<EcommifyApiResponse<IntegrationStatusResponse[]>> {
        const api = this._config?.apiConfig?.serviceUrl;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient
            .get<EcommifyApiResponse<IntegrationStatusResponse[]>>(
                `${api}/${companyID}/integration-status`,
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        search,
                    },
                }
            )
            .pipe(
                tap((response: any) => {
                    const { result } = response;
                    const pagination = GridUtils.getPagination(result);
                    this._pagination.next(pagination);
                    this._integrationStatusData.next(result?.integration_instances);
                }),
                catchError((_error: any) => {
                    return of(null)
                })
            );
    }


}
