import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, of, Subject, switchMap, takeUntil, } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { SyncLogsService } from '../sync-logs.service';
import { SyncLog } from '../sync-logs.types';
import { OrdersList } from './order.type';
import { IntegrationService } from 'app/modules/settings/integrations/integration.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'eco-sync-logs-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SyncLogsOrdersComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    orderDetails: any;
    syncLogOrders$: Observable<OrdersList[]>;
    viewOrder: boolean = false;
    flashMessage: 'success' | 'error' | null = null;
    showFilter: boolean = false;
    isLoading: boolean = false;
    pagination: Pagination;
    selectedSyncLog: SyncLog | null = null;
    selectedSyncLogForm: UntypedFormGroup;
    tags: Tag[];
    filteredTags: Tag[];
    restrictedToIntegrationTags: Tag[];
    filteredRestrictedToIntegrationTags: Tag[];
    tagsEditMode: boolean = false;
    lifecycles: Array<any> = [{ name: "awaitingDispatch", value: "Awaiting Dispatch" }, { name: "completed", value: "Completed" }, { name: "syncingtoSource", value: "Syncing to Source" }]
    filterObject: any = {
        search: "",
        created_date: "",
        integration_instance: "",
        status: "",
        lifecycle: "",
        action_required: "",
        integration_name: "",
        lifecycle_name: "",
        action: ''

    }
    isfilterApplied: boolean = false;
    sortObj: any = {};
    searchTimeout: any;
    popoverTable: any = {
        columns: ['date', 'result', 'action'],
    }
    columnsToBeDisplayed: string[] = [
        'date',
        'integration',
        'sync_status',
        'sync_lifecycle',
        'source_order_id',
        'channel_order_id',
        'grand_total',
        'items',
        'shipment',
        'action_request',
        'details'
    ];
    integrationPanelOpen: boolean = false;
    isIntegrationFilterApplied: boolean = false;
    datePanelOpen: boolean = false;
    isDateFilterApplied: boolean = false;
    actionPanelOpen: boolean = false;
    isActionFilterApplied: boolean = false;
    lifecyclePanelOpen: boolean = false;
    isLifecycleFilterApplied: boolean = false;
    statusPanelOpen: boolean = false;
    isStatusFilterApplied: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    getStatus(status) {
        switch (status) {
            case 'complete':
                return '#22bfb7';
            case 'Warning':
                return 'orange';
            case 'Error':
                return '#c92d0e';
        }
    }


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _syncLogService: SyncLogsService,
        private _integrationService: IntegrationService,
        private datePipe: DatePipe
    ) { }


    ngOnInit(): void {
        // Create the selected syncLog form
        this.selectedSyncLogForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            email: [''],
            role: [''],
            active: [''],
            notes: [''],
            tags: [[]],
        });

        /* Get sync log orders list*/
        this.syncLogOrders$ = this._syncLogService.syncLogOrders$;

        /* Get Integrations list */
        this._integrationService.integrationInstances$
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(integrations =>
                    integrations.map(integration => {
                        return {
                            id: integration.instance_id,
                            title: integration.name,
                        };
                    })
                )
            )
            .subscribe((integrations: Tag[]) => {
                // Update the tags
                this.restrictedToIntegrationTags = integrations;
                this.filteredRestrictedToIntegrationTags = integrations;
                this._changeDetectorRef.markForCheck();

            });

        // Get the pagination
        this._syncLogService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();

            });

        // Get the tags
        this._syncLogService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: Tag[]) => {
                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;
                this._changeDetectorRef.markForCheck();

            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            this._sort.sort({
                id: 'created_at',
                start: 'desc',
                disableClear: true,
            });
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /* Page Change Event  */
    pageChange(event) {
        this.closeDetails();
        this.isLoading = true;
        if (this.isfilterApplied) {
            const filter = this.prepareFilterObject(this.filterObject);
            return this._syncLogService.getSyncLogOrders(
                event.pageIndex,
                event.pageSize,
                this.sortObj?.active,
                this.sortObj?.direction,
                filter
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        } else {
            return this._syncLogService.getSyncLogOrders(
                event.pageIndex,
                event.pageSize,
                this.sortObj?.active,
                this.sortObj?.direction
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        }
    }

    /* Table Sort Event  */
    sortTable(event) {
        this.closeDetails();
        this.sortObj.active = event.active;
        this.sortObj.direction = event.direction;
        this.isLoading = true;
        if (this.isfilterApplied) {
            const filter = this.prepareFilterObject(this.filterObject);
            return this._syncLogService.getSyncLogOrders(
                this.pagination.page,
                this.pagination.size,
                this.sortObj?.active,
                this.sortObj.direction,
                filter
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        } else {
            return this._syncLogService.getSyncLogOrders(
                this.pagination.page,
                this.pagination.size,
                this.sortObj?.active,
                this.sortObj?.direction
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        }
    }

    /* Filter Change Event  */
    handleFilterChange() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.closeDetails();
            this.isLoading = true;
            const filter = this.prepareFilterObject(this.filterObject);
            this.pagination.page = 0;
            this.pagination.size = 25;
            this.sortObj.active = 'created_at';
            this.sortObj.direction = 'desc';
            return this._syncLogService.getSyncLogOrders(
                this.pagination.page,
                this.pagination.size,
                this.sortObj.active,
                this.sortObj.direction,
                filter
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                this.isfilterApplied = true;
                return result;
            });
        }, 300);
    }

    /* Filter Object Preparation Function  */
    prepareFilterObject(filterObject) {
        const filter = JSON.parse(JSON.stringify({ ...filterObject }));
        filter.created_date = filter.created_date ? moment(filter.created_date).format('DD-MM-yyyy') : null;
        Object.keys(filter).forEach(key => {
            if (filter[key] === undefined || filter[key] == null || filter[key] == '') {
                delete filter[key];
            }
        })
        return filter;
    }

    /* Clear Filter Function  */
    clearFilter() {
        this.filterObject = {};
        this.isfilterApplied = false;
        this.isIntegrationFilterApplied = false;
        this.isDateFilterApplied = false;
        this.isActionFilterApplied = false;
        this.isLifecycleFilterApplied = false;
        this.isStatusFilterApplied = false;
        this.handleFilterChange();
    }

    /* Refresh table Function  */
    refreshOrderTable() {
        if (this.isfilterApplied) {
            const filter = this.prepareFilterObject(this.filterObject);
            return this._syncLogService.getSyncLogOrders(
                this.pagination.page,
                this.pagination.size,
                this.sortObj?.active,
                this.sortObj.direction,
                filter
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        } else {
            return this._syncLogService.getSyncLogOrders(
                this.pagination.page,
                this.pagination.size,
                this.sortObj?.active,
                this.sortObj?.direction
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
                this.isLoading = false;
                return result;
            });
        }
    }

    /**
     * Toggle syncLog details
     *
     * @param syncLogId
     */
    toggleDetails(syncLogId: string): void {
        // If the syncLog is already selected...

        if (this.selectedSyncLog && this.selectedSyncLog.syncId === syncLogId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the syncLog by id
        this._syncLogService.getSyncLogById(syncLogId).subscribe(syncLog => {
            // Set the selected syncLog
            this.selectedSyncLog = syncLog;

            // Fill the form
            this.selectedSyncLogForm.patchValue(syncLog);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedSyncLog = null;
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean {
        return !!!(
            inputValue === '' ||
            this.tags.findIndex(
                tag => tag.title.toLowerCase() === inputValue.toLowerCase()
            ) > -1
        );
    }

    /**
     * Create syncLog
     */
    createSyncLog(): void {
        // Create the syncLog
        this._syncLogService.createSyncLog().subscribe(newsyncLog => {
            // Go to new syncLog
            this.selectedSyncLog = newsyncLog;

            // Fill the form
            this.selectedSyncLogForm.patchValue(newsyncLog);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected syncLog using the form data
     */
    updateSelectedSyncLog(): void {
        // Get the syncLog object
        const syncLog = this.selectedSyncLogForm.getRawValue();

        // Remove the currentImageIndex field
        delete syncLog.currentImageIndex;

        // Update the syncLog on the server
        this._syncLogService.updateSyncLog(syncLog.id, syncLog).subscribe(() => {
            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected syncLog using the form data
     */
    deleteSelectedSyncLog(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete syncLog',
            message:
                'Are you sure you want to remove this syncLog? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe(result => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the syncLog object
                const syncLog = this.selectedSyncLogForm.getRawValue();

                // Delete the syncLog on the server
                this._syncLogService.deleteSyncLog(syncLog.id).subscribe(() => {
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    /**
     * View Order Details
     */
    viewOrderDetails(event: any) {
        this.viewOrder = true;
        this.orderDetails = event;
    }

    /**
     * Cancel Create User
     */
    cancelCreateUser(): void {
        this.viewOrder = false;
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Track By Function
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    showHideFilter(): void {
        this.showFilter = !this.showFilter;
    }

    applyIntegrationFilter(filter: any) {
        this.integrationPanelOpen = false;
        if (filter) {
            this.isIntegrationFilterApplied = true;
            this.filterObject = { ...this.filterObject, integration_instance: filter };
            this.filterObject = { ...this.filterObject, integration_instance: filter, integration_name: this.filteredRestrictedToIntegrationTags.find((integration: any) => integration.id === filter).title };
            this.handleFilterChange();
        }
    }

    applyDateFilter(filter: any) {
        this.datePanelOpen = false;
        if (filter) {
            this.isDateFilterApplied = true;
            this.filterObject = { ...this.filterObject, created_date: filter };
            this.handleFilterChange();
        }
    }

    applyActionFilter(filter: any) {
        this.actionPanelOpen = false;
        if (filter) {
            this.isActionFilterApplied = true;
            this.filterObject = { ...this.filterObject, action_required: filter, action: filter == 'Y' ? 'Yes' : 'No' };
            this.handleFilterChange();
        }
    }

    applyLifecycleFilter(filter: any) {
        this.lifecyclePanelOpen = false;
        if (filter) {
            this.isLifecycleFilterApplied = true;
            this.filterObject = { ...this.filterObject, lifecycle: filter, lifecycle_name: `${filter == 'awaitingDispatch' ? 'Awaiting Dispatch' : filter == 'completed' ? 'Completed' : "Syncing to Source"}` };
            this.handleFilterChange();
        }
    }

    applyStatusFilter(filter: any) {
        this.statusPanelOpen = false;
        if (filter) {
            this.isStatusFilterApplied = true;
            this.filterObject = { ...this.filterObject, status: filter };
            this.handleFilterChange();
        }
    }

}
