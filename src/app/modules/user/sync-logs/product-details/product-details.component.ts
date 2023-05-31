import { ChangeDetectorRef, Component, OnInit, Input, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSettingsTypes } from 'app/core/config/app.config';
import { UserService } from 'app/core/user/user.service';
import { ProductsService } from '../products/products.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductAttributeGroupService } from 'app/shared/service/product-attribute-group.service';
import { ProductAttribute } from '../products/products.types';

@Component({
    selector: 'eco-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class SyncLogsProductDetailsComponent implements OnInit, AfterViewInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @Input() showAvatar: boolean = true;

    @ViewChild('skuInput') skuInput;
    @ViewChild('ginInput') ginInput;
    @ViewChild("nameInput") nameInput;

    productID: string;
    productDetails = {
        sku: '',
        name: '',
        gtin: '',
        previous: 0,
        next: 0,
        attributes: {},
        isNameEditable: false,
        isSkuEditable: false,
        isGtinEditable: false,
        isStatusEditable: false,
        updated_at: new Date,
        created_at: new Date,
        status: ''
    };
    selectedLayoutArray = ['is_left_side_attribute'];
    selectedCompleteness: Number;
    tabOptions = [
        { label: 'Attributes', code: 'attributes' },
        { label: 'Assets', code: 'assets' },
        { label: 'Categories', code: 'categories' },
        { label: 'Variations', code: 'variations' },
        { label: 'Relationships', code: 'relationships' },
        { label: 'Change log', code: 'change_log' }
    ]
    selectedTab: any;
    isCompleteness: boolean = false;
    isHideEmpty: boolean = false;
    mode: 'determinate' | 'indeterminate';
    progress: number = 20;
    attributeTypes = {
        'text': "Short Text",
        'paragraph': "Paragraph",
        'html': "HTML",
        'integer': "Integer",
        'decimal': "Decimal",
        'dropdown': "Dropdown",
        'multiselect': "Multiselect",
        'date': "Date",
        'url': "URL",
        'boolean': "Boolean",
        'media_single': "Media (Single)",
        'media_gallery': "Media Gallery",
        'completeness': "Completeness",
    }

    attributesList = [];
    attributeGroupsList = [];
    search = {
        is_left_side_attribute: '',
        is_right_side_attribute: ''
    }
    changeCount: number = 0;
    selectedAttribute = {
        is_left_side_attribute: -1,
        is_right_side_attribute: -1
    }
    completenessList = [];
    productStatus = [];
    user: User;

    customAttributeDropdown = {
        is_left_side_attribute: {
            isOpen: false,
            isHide: false,
            search: '',
            selectedGroupId: -1,
            selectedGroupName: 'All custom attributes'
        },
        is_right_side_attribute: {
            isOpen: false,
            isHide: false,
            search: '',
            selectedGroupId: -1,
            selectedGroupName: 'All custom attributes'
        }
    }


    isDrawerLoad: boolean = false;
    editColumnDrawerOpened: boolean = false;
    selectedAttributes: ProductAttribute[] = [];
    productAttributeList: ProductAttribute[] = [];
    selectedAttributeMapByLabel: any;
    tableSetting: any;
    isLoading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private _productService: ProductsService,
        private _productAttributeGroupService: ProductAttributeGroupService,
        private _userService: UserService,
        private router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private dialog: MatDialog,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {

        if (this.tabOptions)
            this.selectedTab = this.tabOptions[0];

        this.route.params.subscribe(params => {
            this.productID = params['id'];
            this.getProductDetails(this.productID);
            this.getCompletenessList(this.productID);
        });

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                this._changeDetectorRef.markForCheck();
            });

        if (this.route.snapshot?.data?.attributeList && this.route.snapshot?.data?.attributeList[1]?.result) {
            let result = this.route.snapshot.data.attributeList[1].result;
            let attributeObject = result?.product_attributes.find(attribute => {
                return attribute.code == 'sys.status';
            })
            this.productStatus = attributeObject?.settings?.options || [];
        }

        this.selectedAttributes = this.route.snapshot.data?.setting?.setting && this.route.snapshot.data?.setting?.setting.length > 0 ? this.route.snapshot.data?.setting?.setting[0]?.setting?.fields : [];
        if (this.route.snapshot.data?.attributeList.length > 0) {
            this.productAttributeList = [];
            this.route.snapshot.data?.attributeList.forEach((response) => {
                const { result } = response;
                this.productAttributeList = this.productAttributeList.concat(result?.product_attributes);
            });
        }

        if (!this.selectedAttributes || this.selectedAttributes.length <= -1) {
            this.getTableSettings().pipe(takeUntil(this._unsubscribeAll)).subscribe(({ setting }) => {
                if (setting && setting.length > 0) {
                    this.selectedAttributes = setting[0].setting?.fields.filter(item => item != null);
                    this.selectedAttributeMapByLabel = {};
                    this.selectedAttributes.forEach(item => this.selectedAttributeMapByLabel[item?.label.toLowerCase()] = item);
                }
                this.isLoading = true;
            });
        } else {
            this.selectedAttributes = this.selectedAttributes.filter(item => item != null);
            this.selectedAttributeMapByLabel = {};
            this.selectedAttributes.forEach(item => this.selectedAttributeMapByLabel[item?.label?.toLowerCase()] = item);
            this.isLoading = true;
        }
    }

    ngAfterViewInit(): void {
        this.isDrawerLoad = true;
        this._changeDetectorRef.detectChanges();
    }

    getTableSettings() {
        return this._productService.getUserSettings({ type: UserSettingsTypes.product_view }).pipe(takeUntil(this._unsubscribeAll))
    }

    /**
   * Get Product Details
   */
    getProductDetails(productID) {
        this._productService.getProductDetails(productID).subscribe(response => {
            const { result } = response;
            this.productDetails = result || {};
            if (this.route.snapshot?.data?.attributeList && this.route.snapshot?.data?.attributeList[1]?.result) {
                let result_product_attributes = this.route.snapshot.data.attributeList[0].result;

                result_product_attributes?.product_attributes.forEach(attribute => {
                    attribute['is_left_side_attribute'] = true;
                    attribute['is_right_side_attribute'] = true;
                    attribute['value'] = this.productDetails.attributes[attribute.code];
                    if (!attribute['value'] && (attribute['type'] == 'media_single' || attribute['type'] == 'media_gallery')) {
                        attribute['value'] = [];
                    }
                    if (attribute['value'] && (attribute['value'].length > 0) && (attribute['type'] == 'media_single' || attribute['type'] == 'media_gallery')) {
                        let imageArray = [];
                        attribute['value'].forEach((imageId) => {
                            if (imageId) {
                                imageArray.push({ id: imageId, original_url: this.productDetails['media'][imageId] })
                            }
                        })
                        attribute['value'] = imageArray || [];
                    }
                    if (attribute['value'] && (attribute.type == 'dropdown' || attribute.type == 'multiselect')) {
                        attribute['value'] = attribute['value'] + '';
                        attribute['optionValues'] = '';
                        let valueArray = attribute['value'].split(',');
                        valueArray.forEach((value, j) => {
                            attribute['optionValues'] += attribute?.settings?.options[value] + (j == (valueArray.length - 1) ? '' : ', ');
                        });
                    }
                });
                this.attributesList = result_product_attributes?.product_attributes || [];
            }
            this.getAttributeGroups();
        }, error => {
            console.log(error);
        });
    }

    /**
   * Get Completeness Attribute List
   */
    getCompletenessList(productID) {
        this._productService.getCompletenessList(productID).subscribe(response => {
            this.completenessList = response.attribute_groups || [];
        }, error => {
            console.log(error);
        });
    }

    /**
    * Search for Custom Attribute Group Dropdown
    */
    searchAttributeWithGroup(ui_section) {
        if (this.customAttributeDropdown[ui_section].search) {
            let filteredData = this.attributeGroupsList.filter(
                group => (((group.name).toLowerCase()).indexOf(this.customAttributeDropdown[ui_section].search) > -1));

            let index = -1;
            this.attributeGroupsList.forEach((attributeGroup) => {
                index = filteredData.findIndex((data) => {
                    return attributeGroup.id == data.id;
                })
                attributeGroup[ui_section] = index > -1 ? true : false;
            });
        } else {
            this.attributeGroupsList.forEach((attributeGroup) => {
                attributeGroup[ui_section] = true;
            });
        }
    }

    /**
    * Filter List of Product Attributes by selected "custom Attribute Group"
    */
    filterAttributeWithGroup(ui_section, groupIndex) {
        if (groupIndex == -1) {
            this.attributesList.forEach((attribute) => {
                attribute[ui_section] = true;
            });
        } else {
            let codeIndex = -1;
            this.attributesList.forEach((attribute) => {
                codeIndex = this.attributeGroupsList[groupIndex].attributes.indexOf(attribute.code);
                attribute[ui_section] = codeIndex > -1 ? true : false
            });
        }
    }

    /**
   * Get list of all Attributes
   */
    getAttributes() {
        this._productAttributeGroupService.getUserDefinedProductAttributes(0, 1000, {
            filters: [
                {
                    "field": "type",
                    "operator": "!eq",
                    "value": "completeness"
                }
            ]
        }).subscribe(response => {
            response?.result?.product_attributes.forEach(attribute => {
                attribute['is_left_side_attribute'] = true;
                attribute['is_right_side_attribute'] = true;
                attribute['value'] = this.productDetails.attributes[attribute.code];
                if (!attribute['value'] && (attribute['type'] == 'media_single' || attribute['type'] == 'media_gallery')) {
                    attribute['value'] = [];
                }
                if (attribute['value'] && (attribute.type == 'dropdown' || attribute.type == 'multiselect')) {
                    attribute['value'] = attribute['value'] + '';
                    attribute['optionValues'] = '';
                    let valueArray = attribute['value'].split(',');
                    valueArray.forEach((value, j) => {
                        attribute['optionValues'] += attribute?.settings?.options[value] + (j == (valueArray.length - 1) ? '' : ', ');
                    });
                }
            });
            this.attributesList = response?.result?.product_attributes || [];

            this.attributesList.forEach((attribute, attributeIndex) => {
                if (attribute['type'] == 'media_single' || attribute['type'] == 'media_gallery') {
                    attribute['value'].forEach((image_id, index) => {
                        if (image_id)
                            this.getFile(image_id, attributeIndex, index);
                    })
                }
            });
        }, error => {
            console.log(error);
        });
    }

    getFile(image_id, attributeIndex, index) {
        this._productService.getFile(image_id).subscribe(response => {
            const { result } = response;
            this.attributesList[attributeIndex].value = [];
            this.attributesList[attributeIndex].value[index] = {
                id: result.id,
                original_url: result.original_url
            };
            return response;
        }, error => {
            console.log(error);
        });
    }

    /**
    * Get list of all Attribute Groups
    */
    getAttributeGroups() {
        this._productService
            .getProductAttributeGroups(0, 1000)
            .subscribe(response => {
                this.attributeGroupsList = response?.result?.attribute_groups;
                this.attributeGroupsList.forEach((attributeGroup) => {
                    attributeGroup['is_left_side_attribute'] = true;
                    attributeGroup['is_right_side_attribute'] = true;
                });
            }, error => {
                console.log(error);
            });
    }

    /**
    * Set auto focus when product attribute enable for editing
    */
    setfocus(ui_section, i) {
        setTimeout(() => {
            if (document.getElementById(`attribute_type_${ui_section}_${i}`)) {
                document.getElementById(`attribute_type_${ui_section}_${i}`).focus();
            }
        }, 0);
    }

    /**
    * Limit input field for numbers only
    */
    numberOnly(event) {
        const seperator = '^([0-9])';
        const maskSeperator = new RegExp(seperator, 'g');
        let result = maskSeperator.test(event.key); return result;
    }

    redirectTo(url) {
        this.router.navigate([url]);
    }


    handleFilterChange(ui_section) {
        this.searchProductAttribute(ui_section);
    }

    /**
    * Search for Product Attributes
    */
    searchProductAttribute(ui_section) {
        if (this.search[ui_section]) {
            let filteredData = this.attributesList.filter(
                attribute => {
                    return (((attribute.label).toLowerCase()).indexOf(this.search[ui_section]) > -1)
                }
            );
            let index = -1;
            this.attributesList.forEach((attribute) => {
                index = filteredData.findIndex((data) => {
                    return attribute.code == data.code;
                })
                attribute[ui_section] = index > -1 ? true : false;
            });
        } else {
            this.attributesList.forEach((attribute) => {
                attribute[ui_section] = true;
            });
        }
    }

    /**
    * Check Count of Editable Attributes
    */
    reviewChanges() {
        this.changeCount = 0;
        this.attributesList.forEach((attribute) => {
            if (attribute.isChange) {
                this.changeCount += 1;
            }
        })
    }

    resetEditMode() {
        this.productDetails.isNameEditable = false;
        this.productDetails.isSkuEditable = false;
        this.productDetails.isGtinEditable = false;
        this.productDetails.isStatusEditable = false;
    }

    /**
    * Save Product details
    */
    saveProductDetails(object) {
        let productDetails = {
            sku: this.productDetails['sys.sku'],
            name: this.productDetails['sys.name']
        }
        if (object.isImage) {
            productDetails['sys.main_image'] = this.productDetails['sys.main_image_id'];
        }
        if (object.isGtin) {
            productDetails['gtin'] = this.productDetails['sys.gtin'];
        }
        if (object.isStatus) {
            productDetails['status'] = this.productDetails['sys.status'];
        }
        if (object.isAttribute) {
            productDetails['attributes'] = {};
            this.attributesList.forEach((attribute) => {
                if (attribute.value) {
                    if (attribute.type == 'media_single' || attribute.type == 'media_gallery') {
                        productDetails['attributes'][attribute['code']] = [];
                        attribute.value.forEach((imageObject) => {
                            productDetails['attributes'][attribute['code']].push(imageObject.id);
                        })
                        // productDetails['attributes'][attribute['code']] = attribute.value || '';
                    } else {
                        productDetails['attributes'][attribute['code']] = attribute.value || '';
                    }
                }
            })
        }

        // *** RESET ATTIBUTE STATE BEFORE SAVINGS ***
        this.attributesList.forEach((attribute) => {
            attribute.isChange = false;
        })
        this.selectedAttribute.is_left_side_attribute = -1;
        this.selectedAttribute.is_right_side_attribute = -1;

        this._productService.updateProductDetails(this.productID, productDetails).subscribe(response => {
            const { result } = response;

            if (object.isName) {
                this.productDetails.isNameEditable = false;
            }
            if (object.isStatus) {
                this.productDetails.isStatusEditable = false;
            }
            if (object.isSku) {
                this.productDetails.isSkuEditable = false;
            }
            if (object.isGtin) {
                this.productDetails.isGtinEditable = false;
            }
            if (object.isAttribute) {
                this.changeCount = 0;
                this.attributesList.forEach((attribute) => {
                    attribute.isChange = false;
                })
                this.getCompletenessList(this.productID);
            }
        }, error => {
            console.log(error);
        });
    }

    /**
    * Save File/Media and get Link
    */
    saveImage(e, index) {
        let formData = new FormData();
        formData.append('file', e.target.files[0]);
        formData.append('type', e.target.files[0].type);

        this._productService.saveFile(formData).subscribe(response => {
            if (index > -1) {
                this.attributesList[index].value.push({ original_url: response.result.original_url, id: response.result.id });
                // this.attributesList[index].value.push(response.result.original_url);
                // this.attributesList[index].value.push(response.result.id);
                this.attributesList[index].isChange = true;
                this.reviewChanges();
            }
            if (index == -1) {
                this.productDetails['sys.main_image'] = response.result.original_url;
                this.productDetails['sys.main_image_id'] = response.result.id;
                this.saveProductDetails({ isImage: 1 });
            }
        }, error => {
            console.log(error);
        });
    }

    /**
    * Remove Media from Attribute
    */
    removeMediaValue(valueIndex, attributeIndex) {
        this.attributesList[attributeIndex].value.splice(valueIndex, 1);
        this.attributesList[attributeIndex].isChange = true;
        this.reviewChanges();
    }

    /**
    * Open Delete Product Modal
    */
    openDeleteModal() {
        const dialogRef = this.dialog.open(DeleteProductModalComponent, {
            panelClass: ['p-0'],
            data: {
                product_id: this.productID
            }
        })
        dialogRef.afterClosed().subscribe(result => {
            if (result?.isDelete)
                this.redirectTo('/products');
        })
    }

    /**
    * Validate URL in 'url' Attribute
    */
    validURL(str) {
        if (!str)
            return true;

        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }

    openLink(link) {
        if (this.validURL(link)) {
            window.open(link, '_blank')
        }
    }

    onSelectDate(date, index): void {
        if (date) {
            this.attributesList[index].value = date;
        }
    }

    /**
     * Convert array of index with the string of their values
     */
    optionString(options, value, index) {
        if (options?.length == 0)
            return '';
        value = value + ''
        let valueArray = value.split(',');
        let string = '';
        valueArray.forEach((value, i) => {
            string += options[value] + (i == (valueArray.length - 1) ? '' : ', ');
        });
        this.attributesList[index].optionValues = string;
    }


    openDrawer() {
        this.selectedAttributes = this.clearNull(this.selectedAttributes);
        this.editColumnDrawerOpened = true;
    }

    downloadFile(fileUrl) {
        const link = this.renderer.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', fileUrl);
        link.setAttribute('download', `product_details.csv`);
        link.click();
        link.remove();
    }

    clearNull(arr) {
        return arr.filter(item => item != undefined && item != null && item != '');
    }

    autoFocus() {
        setTimeout(() => {
            if (this.skuInput) this.skuInput.nativeElement.focus();
            if (this.ginInput) this.ginInput.nativeElement.focus();
            if (this.nameInput) this.nameInput.nativeElement.focus();
        }, 100);
    }

    restrictNewLine(e) {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            return false;
        }
    }

    hideAttribute(attribute) {
        if (!this.isHideEmpty || attribute.value)
            if (attribute.type == 'media_single' || attribute.type == 'media_gallery') {
                if (attribute.value.length > 0)
                    return true;
                return false;
            } else {
                return true;
            }
        return false;
    }
}
