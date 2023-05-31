import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { Observable, Subject, takeUntil } from 'rxjs';

import { IntegrationStatusService } from './integration-status.service';
import { IntegrationStatusResponse } from './integration-status.types';

@Component({
  selector: 'eco-integration-status',
  templateUrl: './integration-status.component.html',
  styleUrls: ['./integration-status.component.scss'],
})
export class IntegrationStatusComponent implements OnInit {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  integrationStatusResponse$: Observable<IntegrationStatusResponse[]>;

  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  pagination: Pagination;
  tags: Tag[];
  filteredTags: Tag[];
  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _integrationStatusService: IntegrationStatusService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  getStatus(status: string) {
    switch (status) {
      case 'Active':
        return '#22bfb7';
      case 'Inactive':
        return 'orange';
      case 'Error':
        return '#c92d0e';
    }
  }
  /**
   * On init
   */
  ngOnInit(): void {
    // Get the pagination
    this._integrationStatusService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: Pagination) => {
        this.pagination = pagination; // Update the pagination
        this._changeDetectorRef.markForCheck();// Mark for check
      });

    // Get the Integration Status dashboard data
    this.integrationStatusResponse$ = this._integrationStatusService.IntegrationStatusData$;
  }

  // After View Init
  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Set the initial sort
      this._sort.sort({
        id: 'name',
        start: 'asc',
        disableClear: true,
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the syncLog changes the sort order...
      // this._sort.sortChange
      //   .pipe(takeUntil(this._unsubscribeAll))
      //   .subscribe(() => {
      //     // Reset back to the first page
      //     this._paginator.pageIndex = 0;

      //     // Close the details
      //     this.closeDetails();
      //   });
      // Get syncLogs if sort or page changes
      // merge(this._sort.sortChange, this._paginator.page)
      //   .pipe(
      //     switchMap(() => {
      //       this.closeDetails();
      //       this.isLoading = true;
      //       return this._integrationStatusService.getIntegrationStatusResponseProducts(
      //         this._paginator.pageIndex,
      //         this._paginator.pageSize,
      //         this._sort.active,
      //         this._sort.direction
      //       );
      //     }),
      //     map(() => {
      //       this.isLoading = false;
      //     })
      //   )
      //   .subscribe();
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

  // Track By Function
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
