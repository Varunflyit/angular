import { Component, Input, OnInit } from '@angular/core';
import { ProductAttributeTypes } from 'app/core/config/app.config';

@Component({
    selector: 'eco-bulk-attributes',
    templateUrl: './bulk-attributes.component.html',
    styleUrls: ['./bulk-attributes.component.scss']
})
export class BulkAttributesComponent implements OnInit {

    @Input() attributeList: any = [];

    attributeFormList: any = [];

    productAttributeTypes: any = ProductAttributeTypes;

    // Attrobute form variables
    AF_AT_searchQuery: string;
    AF_MS_searchQuery: string;
    AF_SS_searchQuery: string;

    constructor() { }

    ngOnInit(): void {
        this.attributeFormList.push(this.newAttributeForm)
    }

    addNewAttributeForm() {
        if (this.attributeFormList.length <= 2) {
            this.attributeFormList.push(this.newAttributeForm);
        }
    }

    deleteAttributeForm(index) {
        this.attributeFormList.splice(index, 1);
    }

    resetForm() {
        this.attributeFormList = [];
        this.attributeFormList.push(this.newAttributeForm);
    }

    get newAttributeForm() {
        return {
            attribute: '',
            leaveEmpty: false,
            value: null
        }
    }

}
