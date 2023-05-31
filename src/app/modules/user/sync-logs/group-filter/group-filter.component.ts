import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductGroupsService } from 'app/modules/settings/product-groups/product-groups.service';
import { ProductGroup } from 'app/modules/settings/product-groups/product-groups.types';
import { isNumber } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { SnackbarService } from 'app/shared/service/snackbar.service';

@Component({
    selector: 'eco-group-filter',
    templateUrl: './group-filter.component.html',
    styleUrls: ['./group-filter.component.scss']
})
export class GroupFilterComponent implements OnInit, OnDestroy {

    @Output() onApplyFilter: EventEmitter<any> = new EventEmitter();
    @Output() onClearFilter: EventEmitter<any> = new EventEmitter();

    @Input('selectedFilter') set _selectedFilter(value: any) {
        console.log('value', value);
        if (value) {
            this.form['group_id'] = value?.group_id || [];
            this.form['operator'] = value?.operator || "";
        }
    }

    groupList: ProductGroup[] = [];

    operatorOptions: any[] = [
        { value: 'in', label: 'In' },
        { value: '!in', label: 'Not In' },
    ];

    form: any = {
        group_id: [],
        operator: "",
    }
    selectedFilterBlockIndex: number;
    editBlockIndex: number;
    editFilterIndex: number;

    isExpanded: boolean = true;
    isEditPanelOpen: boolean = false;
    panelOpenFor: "ADD" | "EDIT" = 'ADD';
    _unsubscribeAll: Subject<any> = new Subject();

    constructor(
        private _productGroupsService: ProductGroupsService,
        private _snackbarService: SnackbarService) { }

    ngOnInit(): void {
        this._productGroupsService.getProductGroupsData(0, 1000).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
            if (response) {
                const { result } = response;
                this.groupList = result.groups
            }
        })
    }

    ngOnDestroy() {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    applyColumnFilter() {
        if(!this.form.operator) {
            this._snackbarService.showError("Please fillup the form.");
            return;
        }
        this.onApplyFilter.emit(this.form);
    }

    resetForm() {
        this.form = {
            group_id: [],
            operator: ""
        }
    }

    clearFilterByButton() {
        this.resetForm();
        this.onClearFilter.emit({});
    }

    clearFilter() {
        this.resetForm();
    }

}
