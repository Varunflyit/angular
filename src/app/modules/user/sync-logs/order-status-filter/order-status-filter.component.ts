import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isNumber } from 'lodash';

@Component({
  selector: 'eco-order-status-filter',
  templateUrl: './order-status-filter.component.html',
  styleUrls: ['./order-status-filter.component.scss']
})

export class OrderStatusFilterComponent implements OnInit {
  @Output() onPanelClose: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteFilter: EventEmitter<any> = new EventEmitter();
  @Output() onPanelOpen: EventEmitter<any> = new EventEmitter();
  @Input() status: string = "";

  isEditPanelOpen: boolean = false;
  isExpanded: boolean = true;
  panelOpenFor: "ADD" | "EDIT" = 'ADD';
  selectedFilterBlockIndex: number;
  editBlockIndex: number;
  filter: Array<any> = [];
  editFilterIndex: number;

  form: any = {
    attribute: "",
    operator: "",
    value: ""
  }

  openEditPanel(editItem: any, blockIndex: number = null, filterIndex: number = null) {
    this.panelOpenFor = 'EDIT';
    this.form = editItem;
    this.editBlockIndex = blockIndex;
    this.editFilterIndex = filterIndex;
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
      attribute: "",
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
    this.onPanelClose.emit(object);
  }

  addNewFilter(blockIndex: number = null) {
    this.panelOpenFor = 'ADD';
    this.selectedFilterBlockIndex = blockIndex;
    this.isEditPanelOpen = true;
    this.onPanelOpen.emit();
  }

  applyColumnFilter() {
    this.isEditPanelOpen = false;
    this.onPanelClose.emit(this.status)
  }

  ngOnInit(): void {
  }


}
