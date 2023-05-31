import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductAttribute } from '../products/products.types';

@Component({
    selector: 'eco-bulk-edit-modal',
    templateUrl: './bulk-edit-modal.component.html',
    styleUrls: ['./bulk-edit-modal.component.scss']
})
export class BulkEditModalComponent implements OnInit {

    activeTab: 'attribute' | 'category' | 'relationship' | 'findReplace' = 'attribute';

    // @Input() attributeList: any = [
    //     {
    //         "behavior": "none",
    //         "column": "sku",
    //         "fixed": true,
    //         "options": [],
    //         "sortable": true,
    //         "title": "SKU",
    //         "type": "TextAttribute",
    //         "width": 136
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "label",
    //         "fixed": true,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Label",
    //         "type": "TextAttribute",
    //         "width": 206
    //     },
    //     {
    //         "behavior": "none",
    //         "column": "thumbnail",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": false,
    //         "title": "Thumbnail",
    //         "type": "MediaAttribute",
    //         "width": 204
    //     },
    //     {
    //         "behavior": "none",
    //         "column": "modified",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Last modified",
    //         "type": "DateAttribute",
    //         "width": 252
    //     },
    //     {
    //         "behavior": "none",
    //         "column": "categories",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": false,
    //         "title": "Categories",
    //         "type": "MultiSelectAttribute",
    //         "width": 252
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "status",
    //         "fixed": false,
    //         "options": [
    //             "Draft",
    //             "Completed"
    //         ],
    //         "sortable": true,
    //         "title": "Status",
    //         "type": "DropdownAttribute",
    //         "width": 204
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.spanish_content_complete",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Spanish Content Complete",
    //         "type": "CompletenessAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.english_content_complete",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "English Content Complete",
    //         "type": "CompletenessAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.google_shopping_completeness",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Google Shopping Completeness",
    //         "type": "CompletenessAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.french_content_complete",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "French Content Complete",
    //         "type": "CompletenessAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.amazon_completeness",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Amazon Ready",
    //         "type": "CompletenessAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "none",
    //         "column": "created",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Created",
    //         "type": "DateAttribute",
    //         "width": 336
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.short_description",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "English Short Description",
    //         "type": "MultilineAttribute",
    //         "width": 256
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.brand",
    //         "fixed": false,
    //         "options": [
    //             "Plytix Swag Co"
    //         ],
    //         "sortable": true,
    //         "title": "Brand",
    //         "type": "DropdownAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.condition",
    //         "fixed": false,
    //         "options": [
    //             "New",
    //             "Refurbished",
    //             "Used"
    //         ],
    //         "sortable": true,
    //         "title": "Condition",
    //         "type": "DropdownAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.product_color_multiselect",
    //         "fixed": false,
    //         "options": [
    //             "Athletic Heather",
    //             "Beige",
    //             "Black",
    //             "Green",
    //             "Grey",
    //             "Multicolor",
    //             "Purple",
    //             "Sport Grey",
    //             "Turquoise",
    //             "White"
    //         ],
    //         "sortable": false,
    //         "title": "Product Color",
    //         "type": "MultiSelectAttribute",
    //         "width": 224
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.gender",
    //         "fixed": false,
    //         "options": [
    //             "female",
    //             "male",
    //             "unisex"
    //         ],
    //         "sortable": true,
    //         "title": "Gender",
    //         "type": "DropdownAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.availability",
    //         "fixed": false,
    //         "options": [
    //             "in stock",
    //             "out of stock",
    //             "preorder"
    //         ],
    //         "sortable": true,
    //         "title": "Availability",
    //         "type": "DropdownAttribute",
    //         "width": 168
    //     },
    //     {
    //         "behavior": "default",
    //         "column": "attributes.price_google_shopping",
    //         "fixed": false,
    //         "options": [],
    //         "sortable": true,
    //         "title": "Price (Google Shopping)",
    //         "type": "DecimalAttribute",
    //         "width": 136
    //     }
    // ]

    attributeList: ProductAttribute[] = [];
    form: any = {};

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<BulkEditModalComponent>

    ) { }

    ngOnInit(): void {
        console.log('data', this.data);
        this.form = {
            filters: [
                [
                    {
                        field: 'id',
                        operator: 'in',
                        value: this.data.selected.map(product => product.id)
                    }
                ]
            ]
        }

        this.attributeList = this.data?.attributeList || [];

        console.log('form', this.form);
    }

    closeDialog(data: any = null) {
        this.dialogRef.close(data);
    }

    submitAttributeForm(value: any) {
        console.log('attribute form submit : ', value)
    }

    submitFindReplaceForm(value) {
        console.log('find & replace form submit : ', value)
    }

    submitRelationshipForm(bulkRelationship) {
        console.log('relationship form submit : ', bulkRelationship.relationshipForm, bulkRelationship.selection.selected);
    }

}
