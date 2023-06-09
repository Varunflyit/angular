import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    filter,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { OrderFilterObject, SyncLog } from './sync-logs.types';
import { appConfig } from 'app/core/config/app.config';
import { GridUtils } from 'app/layout/common/grid/grid.utils';
import { OrderListResponse, OrdersList } from './orders/order.type';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import {
    Integration,
    IntegrationListResponse,
} from 'app/modules/admin/integrations/integration.types';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

@Injectable({
    providedIn: 'root',
})
export class SyncLogsService {
    // Private
    private _config = appConfig;
    private _syncLog: BehaviorSubject<SyncLog | null> = new BehaviorSubject(null);
    private _syncLogs: BehaviorSubject<SyncLog[] | null> = new BehaviorSubject(
        null
    );
    private _syncLogsProducts: BehaviorSubject<SyncLog[] | null> =
        new BehaviorSubject(null);
    private _ordersList: BehaviorSubject<OrdersList[] | null> =
        new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(
        null
    );
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
    private _integrations: BehaviorSubject<Integration[] | null> =
        new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for syncLog
     */
    get syncLog$(): Observable<SyncLog> {
        return this._syncLog.asObservable();
    }

    /**
     * Getter for syncLogs
     */
    get syncLogs$(): Observable<SyncLog[]> {
        return this._syncLogs.asObservable();
    }
    get syncLogProducts$(): Observable<SyncLog[]> {
        return this._syncLogsProducts.asObservable();
    }
    /**
     * Getter for syncLogs orders
     */
    get syncLogOrders$(): Observable<OrdersList[]> {
        return this._ordersList.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }
    get integrations$(): Observable<Integration[]> {
        return this._integrations.asObservable();
    }
    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]> {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get syncLog Orders
     *
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getSyncLogOrders(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: OrderFilterObject = null
    ): Observable<EcommifyApiResponse<OrderListResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient
            .get<EcommifyApiResponse<OrderListResponse>>(
                `${api}/${companyID}/orders`,
                {
                    params: {
                        page: '' + page,
                        size: '' + size,
                        sort,
                        order,
                        ...search,
                    },
                }
            )
            .pipe(
                tap(response => {
                    const { result } = response;
                    const pagination = GridUtils.getPagination(result);
                    this._pagination.next(pagination);
                    result.orders = result.orders.map(order => {
                        order.log.history = order.log.history.sort((a: any, b: any) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        );
                        return order;
                    })
                    this._ordersList.next(result.orders);
                })
            );
    }

    /**
     * Get integrations
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getIntegrations(
        page: number = 0,
        size: number = 1000,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<EcommifyApiResponse<IntegrationListResponse>> {
        const api = this._config?.apiConfig?.baseUrl;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient
            .get<EcommifyApiResponse<IntegrationListResponse>>(
                `${api}/${companyID}/integrations`,
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
                tap(response => {
                    const { result } = response;
                    this._integrations.next(result?.integrations);
                })
            );
    }
    /**
     * Get syncLogs
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getSyncLogProducts(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: Pagination;
        syncLogs: SyncLog[];
    }> {
        return this._httpClient
            .get<{
                pagination: Pagination;
                syncLogs: SyncLog[];
            }>('api/sync-logs', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap(response => {
                    this._pagination.next(response.pagination);
                    this._syncLogs.next(response.syncLogs);
                })
            );
    }
    /**
     * Get syncLog Orders
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    getSyncLogProductsList(
        page: number = 0,
        size: number = 10,
        sort: string = 'name',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
    ): Observable<{
        pagination: Pagination;
        syncLogProducts: SyncLog[];
    }> {
        return this._httpClient
            .get<{
                pagination: Pagination;
                syncLogProducts: SyncLog[];
            }>('api/sync-logs/products', {
                params: {
                    page: '' + page,
                    size: '' + size,
                    sort,
                    order,
                    search,
                },
            })
            .pipe(
                tap(response => {
                    this._pagination.next(response.pagination);
                    this._syncLogsProducts.next(response.syncLogProducts);
                })
            );
    }
    /**
     * Get syncLog by id
     */
    getSyncLogById(id: string): Observable<SyncLog> {
        return this._syncLogs.pipe(
            take(1),
            map(syncLogs => {
                // Find the syncLog
                const syncLog = syncLogs.find(item => item.syncId === id) || null;

                // Update the syncLog
                this._syncLog.next(syncLog);

                // Return the syncLog
                return syncLog;
            }),
            switchMap(syncLog => {
                if (!syncLog) {
                    return throwError('Could not found syncLog with id of ' + id + '!');
                }

                return of(syncLog);
            })
        );
    }

    /**
     * Create syncLog
     */
    createSyncLog(): Observable<SyncLog> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap(syncLogs =>
                this._httpClient.post<SyncLog>('api/sync-log', {}).pipe(
                    map(newSyncLog => {
                        // Update the syncLogs with the new syncLog
                        this._syncLogs.next([newSyncLog, ...syncLogs]);

                        // Return the new syncLog
                        return newSyncLog;
                    })
                )
            )
        );
    }

    /**
     * Update syncLog
     *
     * @param id
     * @param syncLog
     */
    updateSyncLog(id: string, syncLog: SyncLog): Observable<SyncLog> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap(syncLogs =>
                this._httpClient
                    .patch<SyncLog>('api/sync-log', {
                        id,
                        syncLog,
                    })
                    .pipe(
                        map(updatedSyncLog => {
                            // Find the index of the updated syncLog
                            const index = syncLogs.findIndex(item => item.syncId === id);

                            // Update the syncLog
                            syncLogs[index] = updatedSyncLog;

                            // Update the syncLogs
                            this._syncLogs.next(syncLogs);

                            // Return the updated syncLog
                            return updatedSyncLog;
                        })
                    )
            )
        );
    }

    /**
     * Delete the syncLog
     *
     * @param id
     */
    deleteSyncLog(id: string): Observable<boolean> {
        return this.syncLogs$.pipe(
            take(1),
            switchMap(syncLogs =>
                this._httpClient
                    .delete('api/sync-log', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted syncLog
                            const index = syncLogs.findIndex(item => item.syncId === id);

                            // Delete the syncLog
                            syncLogs.splice(index, 1);

                            // Update the syncLogs
                            this._syncLogs.next(syncLogs);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }
}
