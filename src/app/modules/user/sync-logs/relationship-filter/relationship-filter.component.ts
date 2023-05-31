import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isNumber } from 'lodash';
import { SelectSkuModalComponent } from '../select-sku-modal/select-sku-modal.component';

@Component({
    selector: 'eco-relationship-filter',
    templateUrl: './relationship-filter.component.html',
    styleUrls: ['./relationship-filter.component.scss']
})
export class RelationshipFilterComponent implements OnInit {

    @Output() onPanelClose: EventEmitter<any> = new EventEmitter();
    @Output() onDeleteFilter: EventEmitter<any> = new EventEmitter();
    @Output() onPanelOpen: EventEmitter<any> = new EventEmitter();

    filterOptions: string[] = [
        'select',
        'position',
        'weight',
        'thumbnail',
        'name',
        'symbol',
        'state',
        'city',
        'status',
        'country',
        'pincode',
        'short_description',
        'english_description',
        'spanish_description',
    ];

    operatorOptions: any[] = [
        { value: 'exists', label: 'is defined' },
        { value: '!exists', label: 'isnt defined' },
    ];

    form: any = {
        relationship_id: "",
        operator: "",
        product_ids: []
    }
    selectedFilterBlockIndex: number;
    editBlockIndex: number;
    editFilterIndex: number;

    isExpanded: boolean = true;
    filter: Array<any> = [];

    isEditPanelOpen: boolean = false;
    panelOpenFor: "ADD" | "EDIT" = 'ADD';

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
    }

    applyColumnFilter() {
        if (this.panelOpenFor == 'ADD') {
            if (this.filter.length <= 0) {
                // Initial first filter added
                this.filter.push([{ ...this.form }]);
                this.closePanel(this.filter);
            } else {
                if (this.selectedFilterBlockIndex != null && this.selectedFilterBlockIndex != undefined && isNumber(this.selectedFilterBlockIndex)) {
                    // AND Button press
                    this.filter[this.selectedFilterBlockIndex].push(this.form);
                    this.closePanel(this.filter);
                } else {
                    // OR Button press
                    this.filter.push([{ ...this.form }]);
                    this.closePanel(this.filter);
                }
            }
        } else if (this.panelOpenFor == 'EDIT') {
            if (this.editBlockIndex != undefined && this.editBlockIndex != null && this.editFilterIndex != undefined && this.editFilterIndex != null) {
                this.filter[this.editBlockIndex][this.editFilterIndex] = { ...this.form };
                this.closePanel(this.filter);
            }
        }
    }

    openEditPanel(editItem: any, blockIndex: number = null, filterIndex: number = null) {
        this.panelOpenFor = 'EDIT';
        this.form = editItem;
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
        this.onDeleteFilter.emit(this.filter);
    }

    resetForm() {
        this.form = {
            relationship_id: "",
            operator: "",
            value: ""
        }
    }

    closePanel(filter: any = null) {
        this.resetForm();
        this.selectedFilterBlockIndex = null;
        this.isEditPanelOpen = false;
        let object = null;
        if (filter) {
            object = JSON.parse(JSON.stringify(filter));
            object = object.map(block => {
                return block.map(filterItem => {
                    filterItem.operator = filterItem.operator.value;
                    return filterItem;
                })
            })
        }
        console.log('obejct', object);
        this.onPanelClose.emit(object);
    }

    clearFilter() {
        this.filter = [];
    }

    openSkuSelectorModal(isEditMode: boolean = false, blockIndex: number = null, filterIndex: number = null) {
        const dialogRef = this.dialog.open(SelectSkuModalComponent, {
            data: isEditMode ? this.form[blockIndex][filterIndex].product_ids : [],
            panelClass: ['fullscreen-dialog', 'p-0']
        })

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
        })
    }
}
