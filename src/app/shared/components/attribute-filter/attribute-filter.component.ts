import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attribute_Types, OperatorOptions, CharacterOperatorOptions, ProductAttributeTypes } from 'app/core/config/app.config';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { ProductAttribute } from 'app/shared/intefaces/product.types';
import { SnackbarService } from 'app/shared/service/snackbar.service';
import { isNumber } from 'lodash';
import moment from 'moment';
import { Subject } from 'rxjs';
// import { ProductsService } from '../../../modules/user/sync-logs/products/products.service';

interface Form {
    attribute: any,
    operator: string,
    value: any,
    dateFilterType?: boolean | string,
    filterByCharCount: boolean,
    filterByTime: boolean
}
@Component({
    selector: 'eco-attribute-filter',
    templateUrl: './attribute-filter.component.html',
    styleUrls: ['./attribute-filter.component.scss']
})
export class AttributeFilterComponent implements OnInit {

    @Input('selectedFilter') set _filter(value: Array<any>) {
        this.filter = this.convertBooleanToNumbers(value, 'value', { 'Y': true, 'N': false });
        this.filter = this.filter || []
    };

    @Input() title: string = 'Attributes';
    @Input() titleClass: string = '';

    @Output() onPanelClose: EventEmitter<any> = new EventEmitter();
    @Output() onApplyFilter: EventEmitter<any> = new EventEmitter();
    @Output() selectedFilterChange: EventEmitter<any> = new EventEmitter()
    @Output() onDeleteFilter: EventEmitter<any> = new EventEmitter();
    @Output() onClearFilter: EventEmitter<any> = new EventEmitter();
    @Output() onPanelOpen: EventEmitter<any> = new EventEmitter();

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() productAttributes: ProductAttribute[];
    pagination: Pagination;

    operatorOptions: any[] = CharacterOperatorOptions;

    dateFilterType: any[] = ['custom date', 'relative date']

    form: Form = {
        attribute: "",
        operator: "",
        value: '',
        dateFilterType: false,
        filterByCharCount: false,
        filterByTime: false
    }
    attribute_type: any = ProductAttributeTypes;
    selectedFilterBlockIndex: number;
    editBlockIndex: number;
    editFilterIndex: number;
    characterCountCheckboxModel: boolean;
    isTimeMatchCheckboxModel: boolean;
    hasDecimalError: boolean = false;
    AF_AA_searchQuery: string;

    isExpanded: boolean = true;
    filter: Array<any> = [];

    isEditPanelOpen: boolean = false;
    panelOpenFor: "ADD" | "EDIT" = 'ADD';

    constructor(private _snackbarService: SnackbarService) { }

    ngOnInit(): void {
        // this._productService.pagination$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((pagination: Pagination) => {
        //         console.log('pagination', pagination);
        //         this.pagination = pagination;
        //         this.cd.detectChanges();
        //     });


        // forkJoin(
        //     this.getUserDefinedProductAttributes(),
        //     this.getSystemDefinedProductAttributes(),
        //     this.getIntegrationDefinedProductAttributes(),
        // ).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        //     console.log('both response', response);
        //     const { result: userAttributesListResult } = response[0];
        //     const { result: systemAttributesListResult } = response[1];
        //     const { result: integrationAttributesListResult } = response[1];
        //     this.productAttributes = [...userAttributesListResult.product_attributes, ...systemAttributesListResult.product_attributes, ...integrationAttributesListResult.product_attributes];
        // })
    }

    // getUserDefinedProductAttributes(page: number = 0, size: number = 1000, filter: any = null) {
    //     return this._productService.getUserDefinedProductAttributes(page, size, filter).pipe(catchError(error => { return of(null) }));
    // }

    // getSystemDefinedProductAttributes(filter = null) {
    //     return this._productService.getSystemDefinedProductAttributes(filter).pipe(catchError(error => { return of(null) }));
    // }

    // getIntegrationDefinedProductAttributes(filter = null) {
    //     return this._productService.getIntegrationDefinedProductAttributes(filter).pipe(catchError(error => { return of(null) }));
    // }

    applyColumnFilter() {
        if (this.panelOpenFor == 'ADD') {
            const body = this.validateAndUpdateForm(this.form);
            console.log('body add : ', body);
            if (body != null && body != undefined) {
                if (this.filter.length <= 0) {
                    // Initial first filter added
                    this.filter.push([{ ...body }]);
                    this.applyFilter(this.filter);
                } else {
                    if (this.selectedFilterBlockIndex != null && this.selectedFilterBlockIndex != undefined && isNumber(this.selectedFilterBlockIndex)) {
                        // AND Button press
                        this.filter[this.selectedFilterBlockIndex].push(body);
                        this.applyFilter(this.filter);
                    } else {
                        // OR Button press
                        this.filter.push([{ ...body }]);
                        this.applyFilter(this.filter);
                    }
                }
            }
        } else if (this.panelOpenFor == 'EDIT') {
            if (this.editBlockIndex != undefined && this.editBlockIndex != null && this.editFilterIndex != undefined && this.editFilterIndex != null) {
                this.filter[this.editBlockIndex][this.editFilterIndex] = { ...this.form };
                this.applyFilter(this.filter);
            }
        }
    }

    validateAndUpdateForm(form: Form) {
        const obj = JSON.parse(JSON.stringify(form));
        console.log('log', obj);
        if ((obj?.operator?.value == 'exists' || obj?.operator?.value == '!exists') && [this.attribute_type.short_text].indexOf(this.form.attribute.type) != -1) {
            return obj;
        }
        if (!obj.attribute || !obj.operator || obj.value == undefined || obj.value == null || (typeof obj.value != 'boolean' && obj.value == '')) {
            this._snackbarService.showError("Please fillup the form.");
            return null;
        }
        if (obj.type == this.attribute_type.date && obj.dateFilterType == 'custom date') {
            obj.value = moment(obj.value).utc().toISOString();
        }
        return obj;
    }

    hydrateEditItem(form: Form) {
        const obj = JSON.parse(JSON.stringify(form));
        if (obj.attribute.type == this.attribute_type.date && obj.dateFilterType == 'custom date') {
            obj.value = new Date(moment.utc(obj.value).local().toISOString());
        }
        return obj;
    }

    openEditPanel(editItem: any, blockIndex: number = null, filterIndex: number = null) {
        this.panelOpenFor = 'EDIT';
        const body = this.hydrateEditItem(editItem);
        console.log('body open edit', body);
        this.form = body;
        this.editBlockIndex = blockIndex;
        this.editFilterIndex = filterIndex;
        this.isEditPanelOpen = true;
        this.onPanelOpen.emit();
    }

    addNewFilter(blockIndex: number = null) {
        this.panelOpenFor = 'ADD';
        this.selectedFilterBlockIndex = blockIndex;
        this.isEditPanelOpen = true;
        this.onPanelOpen.emit();
    }

    isIntegerNumber(input, control) {
        if (!input) return;
        input = input.toString();
        const integerPattern = /^[-+]?\d+$/;
        if (integerPattern.test(input)) {
            control.hasError = false;
        } else {
            control.hasError = true;
        }
    }

    isPositiveIntegerNumber(input, control) {
        if (!input) return;
        input = input.toString();
        const positiveIntegerPattern = /^\d+$/;
        if (positiveIntegerPattern.test(input) && parseInt(input) > 0) {
            control.hasError = false;
            return true;
        } else {
            control.hasError = true;
            return false;
        }
    }

    deleteFilterItem(blockIndex: number = null, filterIndex: number = null) {
        if (this.filter.length == 1) {
            if (this.filter[blockIndex].length == 1) {
                this.filter.splice(blockIndex, 1);
            } else {
                this.filter[blockIndex].splice(filterIndex, 1);
            }
        } else {
            if (this.filter[blockIndex].length == 1) {
                this.filter.splice(blockIndex, 1);
            } else {
                this.filter[blockIndex].splice(filterIndex, 1);
            }
        }
        this.onDeleteFilter.emit(this.buildFilterJSON(this.filter));
    }

    resetForm() {
        this.form = {
            attribute: "",
            operator: "",
            value: "",
            dateFilterType: this.dateFilterType[0],
            filterByCharCount: false,
            filterByTime: false
        }
    }

    applyFilter(filter: any = null) {
        this.resetForm();
        this.selectedFilterBlockIndex = null;
        this.isEditPanelOpen = false;
        let object = null;
        if (filter) {
            object = this.buildFilterJSON(filter);
        }
        this.selectedFilterChange.emit(filter);
        this.onApplyFilter.emit({ object, filter });
    }

    handleBackClick() {
        this.resetForm();
        this.selectedFilterBlockIndex = null;
        this.isEditPanelOpen = false;
        this.onPanelClose.emit();
    }

    clearFilter() {
        this.filter = [];
        this.onClearFilter.emit(this.buildFilterJSON(this.filter));
    }

    characterCountCheckboxChange(value) {
        if (value == true) {
            this.operatorOptions = OperatorOptions;
            this.form.operator = this.operatorOptions.find(item => item.value == 'eq');
        } else {
            this.operatorOptions = CharacterOperatorOptions;
            this.form.operator = this.operatorOptions.find(item => item.value == 'exists');
        }
    }

    filterByTimeCheckboxChange(value) {
        this.form.value = null;
    }

    dateFilterTypeChange() {
        this.form.filterByTime = false;
        this.form.dateFilterType == 'relative date' ? this.form.value = 7 : this.form.value = '';
    }

    compareAttribute(option1: ProductAttribute, option2: ProductAttribute): boolean {
        return option1 && option2 ? option1?.code === option2?.code : option1 === option2;
    }
    compareOperator(option1: any, option2: any): boolean {
        return option1 && option2 ? option1?.value === option2?.value : option1 === option2;
    }

    handleAttributeSelect() {
        if (this.form?.attribute && this.form?.attribute?.type == this.attribute_type.date) {
            this.form.dateFilterType = this.dateFilterType[0];
        } else {
            this.operatorOptions = CharacterOperatorOptions;
            this.form.operator = this.operatorOptions.find(item => item.value == 'exists');
            this.form.dateFilterType = false;
        }
        if ([this.attribute_type.short_text].indexOf(this.form.attribute.type) != -1) {
            if (this.form.filterByCharCount) {
                this.operatorOptions = OperatorOptions;
                this.form.operator = this.operatorOptions.find(item => item.value == 'eq');
            }
        }

    }

    buildFilterJSON(filter) {
        let object = null;
        object = JSON.parse(JSON.stringify(filter));
        object = object.map(block => {
            return block.map(filterItem => {
                filterItem.operator = filterItem.operator.value;
                filterItem.field = filterItem.attribute.attribute_type == Attribute_Types.userDefined ? `attributes.${filterItem.attribute.code}` : filterItem.attribute.code;
                delete filterItem?.attribute;
                return filterItem;
            })
        })
        return object;
    }

    convertBooleanToNumbers(arr: any, checkType: 'boolean' | 'value' = 'boolean', values: any = {}) {
        if (!Array.isArray(arr)) return arr;
        console.log(arr, checkType, values);
        return arr.map(elem => {
            if (Array.isArray(elem)) {
                return this.convertBooleanToNumbers(elem, checkType, values);
            } else if (typeof elem === 'object' && elem !== null) {
                return Object.entries(elem).reduce((acc, [key, value]) => {
                    if (checkType == 'boolean') {
                        if (typeof value === 'boolean') {
                            acc[key] = value ? 1 : 0;
                        } else {
                            acc[key] = this.convertBooleanToNumbers(value, checkType, values);
                        }
                    }
                    if (checkType == 'value') {
                        if (typeof value === 'string' && value in values) {
                            acc[key] = values[value];
                            console.log("value changes", key, acc[key]);
                        } else {
                            acc[key] = this.convertBooleanToNumbers(value, checkType, values);
                        }
                    }
                    return acc;
                }, {});
            } else {
                return elem;
            }
        });
    }

}
