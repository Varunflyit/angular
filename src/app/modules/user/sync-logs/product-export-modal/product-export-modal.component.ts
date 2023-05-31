import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { appConfig } from 'app/core/config/app.config';
import { ProductAttributeGroupService } from 'app/shared/service/product-attribute-group.service';
import _ from 'lodash';
import { catchError, forkJoin, of, Subject, takeUntil } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { ProductAttribute, ProductAttributeGroup } from '../products/products.types';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';

@Component({
    selector: 'eco-product-export-modal',
    templateUrl: './product-export-modal.component.html',
    styleUrls: ['./product-export-modal.component.scss']
})
export class ProductExportModalComponent implements OnInit {

    @Output() onClose: EventEmitter<any> = new EventEmitter();

    @Input() selectedAttributes: ProductAttribute[] = [];
    @Input() attributelist: ProductAttribute[] = [];


    // selectedAttrLabels: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    attributesGroups: ProductAttributeGroup[] = [];
    filteredAttributeList: ProductAttribute[] = [];
    allPanelExpanded: boolean = false;
    selectedAttrQuery: string = '';
    isFiltered: boolean = false;

    private _config = appConfig;
    constructor(
        private _productService: ProductsService,
        private _productAttributeGroupService: ProductAttributeGroupService,
        private cd: ChangeDetectorRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {

        if (this.attributelist.length > 0) {
            forkJoin(
                this.getProductAttributeUserDefinedGroups(),
                this.getProductAttributeSystemDefinedGroups()
            ).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
                const { result: userDefinedGroup } = response[0];
                const { result: systemDefinedGroup } = response[1];
                let userDefined = this.cloneAttributeObjectIntoGroup(this.attributelist, userDefinedGroup.attribute_groups, false);
                let systemDefined = this.cloneAttributeObjectIntoGroup(this.attributelist, systemDefinedGroup.attribute_groups, true);
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
                const { result: userAttributesListResult } = response[0];
                const { result: systemAttributesListResult } = response[1];
                const { result: integrationAttributesListResult } = response[2];
                const { result: userDefinedGroup } = response[3];
                const { result: systemDefinedGroup } = response[4];
                let attributeList = [...userAttributesListResult.product_attributes, ...systemAttributesListResult.product_attributes, ...integrationAttributesListResult.product_attributes];
                let userDefined = this.cloneAttributeObjectIntoGroup(attributeList, userDefinedGroup.attribute_groups, false);
                let systemAndIntegrationDefined = this.cloneAttributeObjectIntoGroup(attributeList, systemDefinedGroup.attribute_groups, true);
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

        this.exportDetails(this.selectedAttributes.map(item => item.label));
    }

    exportDetails(fields) {
        let details = {
            type: 'products',
            format: 'csv',
            fields: fields
        };

        this._productService.exportDetails(details).subscribe(result => {
            if (result?.result?.id) {
                this.close({});
                const api = this._config?.apiConfig?.serviceUrlv1;
                const companyID = LocalStorageUtils.companyId;
                this.downloadFile(`${api}/${companyID}/products/export/${result?.result?.id}`)
            }
        }, error => {
            this.close(false);
        });
    }

    downloadFile(fileUrl) {
        const link = this.renderer.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', fileUrl);
        link.setAttribute('download', `product_details.csv`);
        link.click();
        link.remove();
    }

    cloneAttributeObjectIntoGroup(attributeList, groupList, isSystemDefined: boolean = false) {
        const attributeMap = _.chain(attributeList).keyBy('code').value();
        groupList = groupList.map(group => {
            let internalMap = {};
            group['isSystemDefined'] = isSystemDefined;
            group.attribute_list = group.attributes;
            group.attributes = group.attributes.map(attr => {
                attr in attributeMap ? internalMap[attr] = attributeMap[attr] : null;
                attr = attr in attributeMap ? attributeMap[attr] : { code: attr, label: attr, custom: true };
                return attr;
            })
            group.attr_map = internalMap;
            return group;
        })
        return groupList;
    }
}
