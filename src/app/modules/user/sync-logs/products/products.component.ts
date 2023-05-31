import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Pagination, Tag } from 'app/layout/common/grid/grid.types';
import { ProductsService } from './products.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BulkEditModalComponent } from '../bulk-edit-modal/bulk-edit-modal.component';
import { Attribute_Types, unsaved_table_view, UserSettingsTypes, ProductAttributeTypes } from 'app/core/config/app.config';
import { ActivatedRoute, Router } from '@angular/router';

import _ from 'lodash';
import moment from 'moment';
import { Product, ProductAttribute } from 'app/shared/intefaces/product.types';
import { SnackbarService } from 'app/shared/service/snackbar.service';
import { ProductAttributeGroupService } from 'app/shared/service/product-attribute-group.service';

@Component({
    selector: 'eco-sync-logs-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SyncLogsProductsComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild('table') table: MatTable<any>;
    @ViewChild('cellEdit') cellEdit: ElementRef;



    private _unsubscribeAll: Subject<any> = new Subject<any>();
    // productAttributes$: Observable<ProductAttribute[]>;

    tableViewType: 'table' | 'grid' = 'table';
    gridSize: 's' | 'm' | 'l' = 'm';

    lodash: any = _;
    isLoading: boolean = true;
    pagination: Pagination;
    // productAttributePagination: Pagination;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    imagesExtension: string[] = ['.jpg', 'jpeg', 'png'];
    dataSource: any = new MatTableDataSource<any>();
    showFilter: boolean = false;
    columnsToBeDisplayed: any[] = [];
    columnsToBeDisplayedString: string[] = [];
    selection = new SelectionModel<any>(true, []);
    isAttributeFilterApplied: boolean = false;
    attributePanelOpen: boolean = false;
    groupPanelOpen: boolean = false;
    sortObj: any = {};
    filterObj: any = {};
    selectedFilters: any = [];
    selectedGroups: any = {};

    // Table View Save
    unsaved_table_view: any = unsaved_table_view;
    productAttributeType: any = ProductAttributeTypes;
    isUnsavedView: boolean = true;
    tableView: any;
    tableViewList: any = [];
    tableView_searchQuery: string = "";
    tableViewSave_searchQuery: string = "";
    tableViewDialogRef: MatDialogRef<any>
    viewForm: any = {
        isEditMode: 'true',
        existingViewName: ''
    }

    // Edit Column Drawer
    editColumnDrawerOpened: boolean = false;
    isDrawerLoad: boolean = false;
    selectedAttributes: ProductAttribute[] = [];
    productAttributeList: ProductAttribute[] = [];
    selectedAttributeMapByLabel: any;
    filteredProductAttributes: ProductAttribute[] = [];
    allStatusValues = {
        success: 'success',
        warning: 'warning',
        neutral: 'neutral',
        error: 'error',
        processing: 'warning',
        active: 'success',
        inactive: 'error',
        pending: 'warning',
        sent: 'neutral',
    }
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _productService: ProductsService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private _router: Router,
        private _productAttributeGroupService: ProductAttributeGroupService,
        private _snackbarService: SnackbarService
    ) { }

    ngOnInit(): void {
        this._productService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {
                this.pagination = pagination;
                this._changeDetectorRef.markForCheck();
            });

        console.log('settings', this.route.snapshot.data);
        this.tableViewList = this.route.snapshot.data?.setting?.setting || [];
        this.selectedFilters = this._productAttributeGroupService.convertBooleanToNumbers(this.tableViewList[0]?.setting?.filters, 'value', { "Y": true, "N": false });
        this.selectedAttributes = this.route.snapshot.data?.setting?.setting && this.route.snapshot.data?.setting?.setting.length > 0 ? this.route.snapshot.data?.setting?.setting[0]?.setting?.fields : [];
        this.selectedGroups = this.route.snapshot.data?.setting?.setting?.[0]?.setting?.groupFilters || {};
        if (this.route.snapshot.data?.attributeList.length > 0) {
            this.productAttributeList = [];
            this.route.snapshot.data?.attributeList.forEach((response) => {
                const { result } = response;
                this.productAttributeList = this.productAttributeList.concat(result?.product_attributes);
            });
        }

        if (!this.selectedAttributes || this.selectedAttributes.length <= 0) {
            this.getTableSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe(({ setting }) => {
                if (setting && setting.length > 0) {
                    this.tableViewList = setting || [];
                    this.selectedAttributes = setting[0].setting?.fields.filter(item => item != null);
                    this.selectedGroups = setting[0].setting?.groupFilters;
                    this.filterObj['fields'] = this.selectedAttributes.map(field => field.code);
                    this.applyAttributeFilterSilently(this.selectedFilters);
                    this.applyGroupFilterSilently(this.selectedGroups);
                    this.refreshLabelMap();
                }
                this.isLoading = true;
                this._changeDetectorRef.detectChanges();
                console.log('selectedattribute ofound', this.isLoading);
                this.getProducts(0, 25, null, null, this.filterObj);
            });
        } else {
            this.selectedAttributes = this.selectedAttributes.filter(item => item != null);
            this.filterObj['fields'] = this.selectedAttributes.map(field => field?.code);
            this.refreshLabelMap();
            this.applyAttributeFilterSilently(this.selectedFilters)
            this.applyGroupFilterSilently(this.selectedGroups);
            this.isLoading = true;
            this._changeDetectorRef.detectChanges();
            this.getProducts(0, 25, null, null, this.filterObj);
        }
    }

    ngAfterViewInit(): void {
        this.isDrawerLoad = true;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    refreshProductTable() {
        this.getProducts(0, 25, null, null, this.filterObj);
    }

    /**
     *
     * Component Methods
     */

    pageChange(event) {
        this.isLoading = true;
        return this.getProducts(
            event.pageIndex,
            event.pageSize,
            this.sortObj?.active,
            this.sortObj?.direction,
            this.filterObj
        )
    }

    sortTable(event) {
        console.log('event', event);
        let col = this.selectedAttributeMapByLabel[event.active.toLowerCase()];
        if (col?.attribute_type == Attribute_Types.system) {
            this.sortObj.active = col?.code
        } else if (col?.attribute_type == Attribute_Types.integration) {
            this.sortObj.active = col?.code
        } else if (col?.attribute_type == Attribute_Types.userDefined) {
            this.sortObj.active = `attributes.${col?.code}`
        } else {
            return;
        }
        this.sortObj.direction = event.direction;
        this.isLoading = true;
        return this.getProducts(
            this.pagination.page,
            this.pagination.size,
            this.sortObj?.active,
            this.sortObj.direction,
            this.filterObj
        )
    }

    getProducts(pageIndex = 0, pageSize = 25, sortColumn = null, sortOrder = null, filter = null) {
        if (filter?.fields) {
            filter.fields = this.clearNull(filter.fields);
        }
        this._productService.getProducts(pageIndex, pageSize, sortColumn, sortOrder, filter).subscribe(response => {
            const { result } = response;
            const merged = this.getColumnList((result.products) as Product[]);
            this.columnsToBeDisplayed = merged.columns;
            this.dataSource.data = merged.data;
            this.dataSource.data.forEach((row) => {
                if (row['sys.updated_at'])
                    row['sys.updated_at'] = moment(row['sys.updated_at']).format('DD-MM-YY h:mm:ss A');
                if (row['sys.created_at'])
                    row['sys.created_at'] = moment(row['sys.created_at']).format('DD-MM-YY h:mm:ss A');
            });
            this.columnsToBeDisplayed.splice(this.columnsToBeDisplayed.indexOf('sys.sku'), 1);
            this.columnsToBeDisplayed.splice(this.columnsToBeDisplayed.indexOf('attributes'), 1);
            this.columnsToBeDisplayed.splice(this.columnsToBeDisplayed.indexOf('integration'), 1);
            this.columnsToBeDisplayed.unshift('sys.sku');
            this.columnsToBeDisplayedString = JSON.parse(JSON.stringify(this.columnsToBeDisplayed))
            // Creating Map;
            let map = {};
            this.productAttributeList.forEach(item => map[item?.code?.toLowerCase()] = item);

            if (this.selectedAttributes.length <= 0) {
                // Settings are not available so We need to set default colums in selected attributes
                this.selectedAttributes = this.columnsToBeDisplayed.map(item => map[item.toLowerCase()]);
                // Remove `Id` : id is not an attribute so we need to remove it.
                this.selectedAttributes = this.clearNull(this.selectedAttributes);
            } else {
                // Column Sort according to Setting;
                let codeMap = this.selectedAttributes.map(item => item?.code);
                this.columnsToBeDisplayed.sort(function (a, b) {
                    return codeMap.indexOf(a) - codeMap.indexOf(b);
                });
            }
            this.columnsToBeDisplayed = this.columnsToBeDisplayed.map(item => map[item.toLowerCase()]);
            this.columnsToBeDisplayedString = this.columnsToBeDisplayed.map(item => item?.label);
            this.columnsToBeDisplayed.unshift('select');
            this.columnsToBeDisplayedString.unshift('select');
            this.columnsToBeDisplayed = this.clearNull(this.columnsToBeDisplayed);
            this.columnsToBeDisplayedString = this.clearNull(this.columnsToBeDisplayedString);
            !this.columnsToBeDisplayedString.includes('resizable-last-column-ghost') && this.columnsToBeDisplayedString.push("resizable-last-column-ghost");
            this.refreshColumnWidths();
            if (filter?.filters) {
                this.isAttributeFilterApplied = true;
            }
            if (!filter?.filters) {
                this.isAttributeFilterApplied = false;
            }
            this.table.renderRows();
            this.isLoading = false;
            this._changeDetectorRef.detectChanges();
        }, error => {
            console.log(error);
            this.isLoading = false;
        });
    }

    refreshColumnWidths() {
        let settingField: any = {
            code: '',
            width: 100
        }
        this.columnsToBeDisplayed.forEach((column) => {
            if (column.code) {
                settingField = this.selectedAttributes?.find(field => column.code == field.code)
                if (settingField?.code) {
                    column.width = settingField['width'] ? settingField['width'] : 100;
                }
            }
        });
        this._changeDetectorRef.detectChanges();
    }

    getTableSettings() {
        return this._productService.getUserSettings({ type: UserSettingsTypes.product_view }).pipe(takeUntil(this._unsubscribeAll))
    }

    refreshTable(event) {
        if (event && event?.fields) {
            this.selectedAttributes = event?.fields || [];
            const arr = event?.fields ? event.fields : [];
            this.filterObj['fields'] = arr.map(attribute => attribute?.code);
            this.refreshLabelMap();
            this.resetViewSelection();
            this.getProducts(this.pagination.page, this.pagination.size, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
        }
    }

    // Load Table View
    loadTableView(tableView) {
        if (tableView?.setting?.fields && tableView?.setting?.fields.length > 0) {
            this.isUnsavedView = false;

            // Apply Table Columns
            this.selectedAttributes = this.clearNull(tableView?.setting?.fields);
            this.filterObj['fields'] = this.selectedAttributes.map(field => field.code);
            this.refreshLabelMap();

            // Apply Filters
            this.selectedFilters = this._productAttributeGroupService.convertBooleanToNumbers(tableView?.setting?.filters, 'value', { "Y": true, "N": false });
            this.applyAttributeFilterSilently(this.selectedFilters);

            // Apply Group Filters
            this.selectedGroups = tableView?.setting?.groupFilters;
            console.log('this.selectedGroups', this.selectedGroups);
            this.applyGroupFilterSilently(this.selectedGroups);

            // Api call
            this.isLoading = true;
            this.getProducts(0, 25, null, null, this.filterObj);
        } else {
            this._snackbarService.showError("View can not be loaded.");
        }
    }

    hydrateFilters(fitlers) {

    }

    tableViewCompareItems(option1: any, option2: any) {
        return option1 && option2 ? option1.name === option2.name : option1 === option2;
    }

    applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    applyAttributeFilter({ object, filter }) {
        console.log('filter', object, filter);
        this.attributePanelOpen = false;
        if (object && object?.length > 0) {
            object = this._productAttributeGroupService.convertBooleanToNumbers(object);
            this.filterObj['filters'] = object;
            this.selectedFilters = JSON.parse(JSON.stringify(filter));
            this.saveUserSettingsInUnsaved();
            this.getProducts(0, 25, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
        } else {
            this.clearAttributeFilter();
        }
    }

    applyAttributeFilterSilently(object) {
        if (object && object?.length > 0) {
            console.log('object brfore', object);
            object = this._productAttributeGroupService.convertBooleanToNumbers(object);
            object = this._productAttributeGroupService.buildFilterJSON(object);
            console.log('object', object);
            this.filterObj['filters'] = object;
        } else {
            delete this.filterObj['filters'];
            this.selectedFilters = [];
        }
    }

    applyGroupFilter(object) {
        if (object && object?.group_id && object?.group_id.length > 0 && object?.operator) {
            const groupFilter = {
                value: object.group_id,
                operator: object.operator
            }
            this.selectedGroups = object;
            this.filterObj['groups'] = groupFilter;
            this.saveUserSettingsInUnsaved();
            this.getProducts(0, 25, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
        } else {
            this.clearGroupFilter();
        }
    }

    applyGroupFilterSilently(object) {
        console.log('Object', object);
        if (object && object?.group_id && object?.group_id.length > 0 && object?.operator) {
            const groupFilter = {
                value: object.group_id,
                operator: object.operator
            }
            this.filterObj['groups'] = groupFilter;
        } else {
            delete this.filterObj['groups'];
            this.selectedGroups = {};
        }
    }

    clearAttributeFilter() {
        delete this.filterObj['filters'];
        this.selectedFilters = [];
        this.saveUserSettingsInUnsaved();
        this.getProducts(0, 25, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
    }

    clearGroupFilter() {
        delete this.filterObj['groups'];
        this.selectedGroups = {};
        this.saveUserSettingsInUnsaved();
        this.getProducts(0, 25, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
    }

    isAllSelected() {
        const numSelected = this.selection?.selected?.length;
        const numRows = this.dataSource?.data?.length;
        return numSelected === numRows;
    }

    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    onSingleRecordSelect(event, row) {
        event ? this.selection.toggle(row) : null;
    }

    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1
            }`;
    }

    showHideFilter(): void {
        this.showFilter = !this.showFilter;
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    openBulkEditor() {
        this.dialog.open(BulkEditModalComponent, {
            panelClass: ['fullscreen-dialog', 'p-0'],
            data: {
                selected: this.selection.selected,
                attributeList: this.productAttributeList
            }
        })
    }

    getColumnList(data: Array<Product>) {
        let json = {};
        // let integrationMap = {};

        data = data.map(item => {
            item = { ...item, ...item.integration, ...item.attributes };
            json = { ...json, ...item }
            return item;
        })
        return { columns: Object.keys(json), data: data };
    }

    openDrawer() {
        this.selectedAttributes = this.clearNull(this.selectedAttributes);
        this.editColumnDrawerOpened = true;
    }

    redirectProductDetails(productId) {
        this._router.navigate(['/products/' + productId]);

    }

    clearNull(arr) {
        return arr.filter(item => item != undefined && item != null && item != '');
    }

    isBadge(value) {
        if ((typeof value != 'string') || !value)
            return false;

        value = value.toLowerCase();
        if (value in this.allStatusValues) {
            return true;
        }
        return false;
    }

    getBadgeClass(value) {
        value = value.toLowerCase();
        if (value in this.allStatusValues) {
            return 'badge-' + this.allStatusValues[value];
        }
        return '';
    }

    checkEllipsis(element) {
        if (element?.target?.clientWidth < element?.target?.scrollWidth) {
            var style = element?.target?.currentStyle || window.getComputedStyle(element?.target);
            return style?.textOverflow === 'ellipsis'
        }
        return false;
    }

    refreshLabelMap() {
        this.selectedAttributeMapByLabel = {};
        this.selectedAttributes.forEach(item => this.selectedAttributeMapByLabel[item?.label?.toLowerCase()] = item);
    }

    openTableViewSaveModal(templateRef: TemplateRef<any>) {
        this.tableViewDialogRef = this.dialog.open(templateRef, {
            width: '600px',
            minHeight: "300px",
            panelClass: ['p-0'],
            hasBackdrop: true,
            disableClose: true
        });
    }

    resetViewSelection() {
        this.isUnsavedView = true;
        this.tableView = null;
        this._changeDetectorRef.detectChanges();
    }

    // View Changes : Save User Settings

    handleColumnResize(e) {
        e.index = e.index - 1;
        this.selectedAttributes?.map((field, index) => {
            if (index == e.index)
                field['width'] = e.width;
        });
        // TABLEVIEW SETTING BODY
        const body = this.buildUserSettingBody(unsaved_table_view);
        this._productService.saveUserSettings(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            this.refreshColumnWidths();
            this.resetViewSelection();
        }, error => {
            console.log('error in saving settings', error);
        });
    }

    addOrEditTableView() {
        if (!this.viewForm.existingViewName || this.viewForm.existingViewName == '' || this.viewForm.existingViewName == null) {
            const msg = this.viewForm.isEditMode == 'true' ? 'Please select view.' : 'Pleasse enter view name.'
            this._snackbarService.showError(msg);
            return;
        }
        let isExist = this.tableViewList.find(item => item.name == this.viewForm.existingViewName)
        if (this.viewForm.isEditMode == 'false' && isExist) {
            this._snackbarService.showError('View already exists');
            return;
        }
        // TABLEVIEW SETTING BODY
        const body = this.buildUserSettingBody(this.viewForm.existingViewName);
        this._productService.saveUserSettings(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            console.log('result', response);
            if (response) {
                this.refreshColumnWidths();
                if (this.viewForm.isEditMode == 'true') {
                    this.tableViewList = this.tableViewList.map(view => {
                        return view.name == this.viewForm.existingViewName ? response?.result : view;
                    })
                    this.tableView = response?.result;
                    this._changeDetectorRef.detectChanges();
                } else {
                    this.tableViewList.push(response?.result);
                    this.tableView = response?.result;
                    this._changeDetectorRef.detectChanges();
                }
                this.tableViewDialogRef.close();
            } else {
                if (response.errors) {
                    this.tableViewDialogRef.close();
                    this._snackbarService.showError('View not saved');
                }
            }
        }, error => {
            console.log('error in saving settings', error);
            this.tableViewDialogRef.close();
            this._snackbarService.showError(error?.message || 'View not saved');
        });
    }

    saveUserSettingsInUnsaved() {
        const body = this.buildUserSettingBody(unsaved_table_view);
        this._productService.saveUserSettings(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            this.refreshColumnWidths();
            this.resetViewSelection();
        }, error => {
            console.log('error in saving settings', error);
        });
    }

    buildUserSettingBody(name: string) {
        return {
            name: name,
            type: UserSettingsTypes.product_view,
            setting: {
                fields: this.selectedAttributes,
                labels: this.selectedAttributes.map(item => item.label),
                filters: this.selectedFilters || [],
                groupFilters: this.selectedGroups || {}
            }
        }
    }
}
