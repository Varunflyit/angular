import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { unsaved_table_view, UserSettingsTypes } from 'app/core/config/app.config';
import { ProductAttributeGroupService } from 'app/shared/service/product-attribute-group.service';
import _ from 'lodash';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { ProductAttribute, ProductAttributeGroup } from '../products/products.types';

@Component({
    selector: 'eco-product-edit-column-modal',
    templateUrl: './product-edit-column-modal.component.html',
    styleUrls: ['./product-edit-column-modal.component.scss']
})
export class ProductEditColumnModalComponent implements OnInit {

    @Output() onClose: EventEmitter<any> = new EventEmitter();

    @Input() selectedAttributes: ProductAttribute[] = [];
    @Input() attributelist: ProductAttribute[] = [];
    @Input() existingTableViewName: string = null;


    // selectedAttrLabels: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    attributesGroups: ProductAttributeGroup[] = [];
    filteredAttributeList: ProductAttribute[] = [];
    allPanelExpanded: boolean = false;
    selectedAttrQuery: string = '';
    isFiltered: boolean = false;
    non_dragable_codes: any = ['sys.sku'];

    constructor(private _productService: ProductsService, private _productAttributeGroupService: ProductAttributeGroupService, private cd: ChangeDetectorRef) { }

    ngOnInit(): void {

        if (this.attributelist.length > 0) {
            forkJoin(
                this.getProductAttributeUserDefinedGroups(),
                this.getProductAttributeSystemDefinedGroups()
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
                console.log('result', response);
                const { result: userDefinedGroup } = response[0];
                const { result: systemDefinedGroup } = response[1];
                let userDefined = this._productAttributeGroupService.cloneAttributeObjectIntoGroup(this.attributelist, userDefinedGroup.attribute_groups, false, this.non_dragable_codes);
                let systemDefined = this._productAttributeGroupService.cloneAttributeObjectIntoGroup(this.attributelist, systemDefinedGroup.attribute_groups, true, this.non_dragable_codes);
                this.attributesGroups = [systemDefined[1], systemDefined[2], ...userDefined];
                this.cd.detectChanges();
            });

        } else {
            forkJoin(
                this.getUserDefinedProductAttributes(),
                this.getSystemDefinedProductAttributes(),
                this.getIntegrationDefinedProductAttributes(),
                this.getProductAttributeUserDefinedGroups(),
                this.getProductAttributeSystemDefinedGroups()
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
                console.log('both response', response);
                const { result: userAttributesListResult } = response[0];
                const { result: systemAttributesListResult } = response[1];
                const { result: integrationAttributesListResult } = response[2];
                const { result: userDefinedGroup } = response[3];
                const { result: systemDefinedGroup } = response[4];
                let attributeList = [...userAttributesListResult.product_attributes, ...systemAttributesListResult.product_attributes, ...integrationAttributesListResult.product_attributes];
                let userDefined = this._productAttributeGroupService.cloneAttributeObjectIntoGroup(attributeList, userDefinedGroup.attribute_groups, false, this.non_dragable_codes);
                let systemAndIntegrationDefined = this._productAttributeGroupService.cloneAttributeObjectIntoGroup(attributeList, systemDefinedGroup.attribute_groups, true, this.non_dragable_codes);
                this.attributesGroups = [...systemAndIntegrationDefined, ...userDefined];
                this.cd.detectChanges();
            })
        }
    }

    getUserDefinedProductAttributes(filter = null) {
        return this._productAttributeGroupService.getUserDefinedProductAttributes(0, 1000, filter).pipe(catchError(error => { return of(null) }));
    }

    getSystemDefinedProductAttributes(filter = null) {
        return this._productAttributeGroupService.getSystemDefinedProductAttributes(filter).pipe(catchError(error => { return of(null) }));
    }

    getIntegrationDefinedProductAttributes(filter = null) {
        return this._productAttributeGroupService.getIntegrationDefinedProductAttributes(filter).pipe(catchError(error => { return of(null) }));
    }

    getProductAttributeUserDefinedGroups() {
        return this._productAttributeGroupService.getProductAttributeUserDefinedGroups(0, 1000).pipe(catchError(error => { return of(null) }));
    }

    getProductAttributeSystemDefinedGroups() {
        return this._productAttributeGroupService.getProductAttributeSystemDefinedGroups().pipe(catchError(error => { return of(null) }));
    }

    close(data: any) {
        this.onClose.emit(data);
    }

    save() {
        this.selectedAttributes = this._productAttributeGroupService.clearNull(this.selectedAttributes);
        // TABLEVIEW SETTING BODY
        const body = {
            name: this.existingTableViewName || unsaved_table_view,
            type: UserSettingsTypes.product_view,
            setting: {
                fields: this.selectedAttributes,
                labels: this.selectedAttributes.map(item => item.label)
            }
        }
        console.log('save', body);
        this._productService.saveUserSettings(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
            this.close(result?.result?.setting);
        }, error => {
            console.log('error in saving settings', error);
            this.close(false);
        });
    }
}
