import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Attribute_Types } from 'app/core/config/app.config';
import { ProductAttributeGroup } from 'app/modules/settings/product-attributes/product-attributes.types';
import { ProductAttribute } from 'app/shared/intefaces/product.types';
import _ from 'lodash';

@Component({
    selector: 'eco-attribute-selector',
    templateUrl: './attribute-selector.component.html',
    styleUrls: ['./attribute-selector.component.scss']
})
export class AttributeSelectorComponent implements OnInit, OnDestroy {
    @ViewChild('attribiteTree', { static: true }) attributeTree: MatAccordion

    @Output() selectedAttributesChange: EventEmitter<any> = new EventEmitter();

    @Input('selectedAttributes') set _selectedAttributes(value: ProductAttribute[]) {
        console.log('Input Change : selectedAttributes: ', value);
        this.selectedAttributes = value;
        setTimeout(() => {
            this.reArrangeDragableAttributes();
            this.refreshSelectAllCheckbox();
        }, 0);
    };
    @Input('attributeGroups') set _attributeGroups(value: ProductAttributeGroup[]) {
        console.log('Input Change : attributeGroups: ', value);
        this.attributeGroups = value;
        setTimeout(() => {
            this.attributeGroups = this.attributeGroups.map((group: ProductAttributeGroup) => {
                let arr = []
                group.attributes.forEach(item => {
                    !this.non_closable_codes.includes(item.code) ? arr.push(item) : null;
                });
                group.attributes = arr;
                return group;
            })
            this.backupGroups = JSON.parse(JSON.stringify(this.attributeGroups));
            this.refreshUserSettingSelectedAttributesFromGroup();
            this.refreshSelectAllCheckbox();
        }, 0);
    };
    @Input() leftTitle: string = 'Select Attributes'
    @Input() rightTitle: string = 'Selected Attributes'
    @Input() non_dragable_codes: Array<string> = [];
    @Input() non_closable_codes: Array<string> = [];

    attribute_Types: any = Attribute_Types;
    attributeGroups: ProductAttributeGroup[] = [];
    selectedAttributes: ProductAttribute[] = [];
    allPanelExpanded: boolean = false;
    selectedAttrQuery: string = '';
    isFiltered: boolean = false;
    backupGroups: ProductAttributeGroup[];

    lodash: any = _;
    isSelectedAttributeUpdatedOnce: boolean = false;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        // this.backupGroups = JSON.parse(JSON.stringify(this.attributeGroups));
    }

    ngOnDestroy() {
        this.attributeGroups = this.attributeGroups.map(item => { item['allSelected'] = false; return item; });
    }

    handleDropColumn(event: CdkDragDrop<string[]>) {
        // Here we are splicing some non-dragable elements from top of the array. so we need to shift our drag previous and current index by non-dragable items's length
        moveItemInArray(this.selectedAttributes, event.previousIndex + this.non_dragable_codes.length, event.currentIndex + this.non_dragable_codes.length);
        this.selectedAttributesChange.emit(this.selectedAttributes);
    }

    searchAttribute(value) {
        if (value == null || value == '') {
            this.clearSearchAttribute();
            return;
        }
        this.attributeGroups = JSON.parse(JSON.stringify(this.backupGroups));
        this.attributeGroups = this.attributeGroups.filter(group => {
            let labels = group.attributes.map(attr => attr.label);
            labels = labels.filter(label => label.toLowerCase().includes(value));
            if (labels.length > 0) {
                return true;
            } else {
                return false
            }
        });
        this.attributeGroups = this.attributeGroups.map((group: ProductAttributeGroup) => {
            let labels = group.attributes.map(attr => attr.label);
            labels = labels.filter(label => label.toLowerCase().includes(value));
            let arr = []
            group.attributes.forEach(item => {
                labels.includes(item.label) ? arr.push(item) : null;
            });
            group.attributes = arr;
            return group;
        })
        setTimeout(() => {
            this.attributeTree.openAll();
            this.refreshSelectAllCheckbox();
        }, 100);
    }

    clearSearchAttribute() {
        this.isFiltered = false;
        this.attributeGroups = JSON.parse(JSON.stringify(this.backupGroups));
        this.cd.detectChanges();
    }

    selectAllAttribute(isChecked, index) {
        this.attributeGroups[index]['allSelected'] = isChecked;
        if (this.attributeGroups[index]?.attributes == null) {
            return;
        }
        if (isChecked) {
            const map = _.chain(this.selectedAttributes).keyBy('code').value();
            (this.attributeGroups[index]?.attributes).forEach(item => {
                if (!(item.code in map)) {
                    this.selectedAttributes.push(item);
                }
            })
        } else {
            this.selectedAttributes = this.selectedAttributes.filter(attr => !this.attributeGroups[index]?.attr_map[attr.code]);
        }
        this.refreshSelectAllCheckbox();
        this.selectedAttributesChange.emit(this.selectedAttributes);
        this.cd.detectChanges();
    }

    isIntermediateSelected(index) {
        if (this.attributeGroups[index]?.attributes == null) {
            return false;
        }
        return (this.selectedAttributes.filter(attr => this.attributeGroups[index]?.attr_map[attr.code])).length > 0 && !this.attributeGroups[index]['allSelected'];
    }

    onSelectAttribute(attribute, value) {
        if (value == false) {
            this.selectedAttributes = this.selectedAttributes.filter((attr) => attr?.code != attribute.code);
        } else {
            this.selectedAttributes.push(attribute);
        }
        this.refreshSelectAllCheckbox();
        this.selectedAttributesChange.emit(this.selectedAttributes);
    }

    refreshSelectAllCheckbox(index: number = null) {
        if (index != null) {
            this.attributeGroups[index]['allSelected'] = this.attributeGroups[index]?.attributes != null && this.selectedAttributes.filter(attr => this.attributeGroups[index]?.attr_map[attr.code]).length == this.attributeGroups[index]?.attributes.length;
        } else {
            this.attributeGroups.map(group => {
                group['allSelected'] = group?.attributes != null && this.selectedAttributes.filter(attr => group?.attr_map[attr.code]).length == group?.attributes.length;
            });
        }
    }

    unselectAttribute(attribute) {
        this.selectedAttributes = this.selectedAttributes.filter(attr => attr.code !== attribute.code);
        this.refreshSelectAllCheckbox();
        this.selectedAttributesChange.emit(this.selectedAttributes);
        this.cd.detectChanges();
    }

    clearAllSelectedLabels() {
        this.selectedAttributes = [];
        this.refreshSelectAllCheckbox();
        this.selectedAttributesChange.emit(this.selectedAttributes);
        this.cd.detectChanges();
    }

    collapseAllGroups() {
        this.attributeTree.closeAll();
    }

    refreshUserSettingSelectedAttributesFromGroup() {
        if (this.attributeGroups && this.attributeGroups?.length > 0) {
            let attributeMap = {};
            this.attributeGroups.forEach((group: ProductAttributeGroup) => {
                group?.attributes?.forEach(attribute => {
                    attribute?.code ? attributeMap[attribute?.code] = attribute : null;
                });
            });
            this.selectedAttributes = this.selectedAttributes.map((item: any) => {
                if (item?.code && attributeMap[item?.code] && attributeMap[item?.code]?.label != item?.label) {
                    console.log('replaced attribute : ', item?.label, 'to ', attributeMap[item?.code]['label']);
                    delete attributeMap[item?.code]['id'];
                    return attributeMap[item?.code];
                } else {
                    return item;
                }
            });
            this.selectedAttributesChange.emit(this.selectedAttributes);
        }
    }

    reArrangeDragableAttributes() {
        const non_dragable = [];
        this.non_dragable_codes = this.non_dragable_codes.map(item => {
            let index = this.selectedAttributes.findIndex(attr => attr.code == item);
            if (index > -1) {
                let [spliced] = this.selectedAttributes.splice(index, 1)
                non_dragable.push(spliced);
                this.selectedAttributes.unshift(spliced);
                return item;
            } else {
                return null;
            }
        })
    }
}
