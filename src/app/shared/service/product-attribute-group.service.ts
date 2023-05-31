import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    BehaviorSubject,
    catchError,
    Observable,
    of,
    tap
} from 'rxjs';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { appConfig, Attribute_Types } from 'app/core/config/app.config';
import { EcommifyApiResponse } from 'app/core/api/api.types';

import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { ProductAttributeGroup, ProductAttributeListResponse, ProductUserDefinedAttributeGroupsResponse } from '../intefaces/product.types';
import _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class ProductAttributeGroupService {

    private _config = appConfig;
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
    private _productAttributeGroupList: BehaviorSubject<ProductAttributeGroup[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }


    // Attribute APIS
    getUserDefinedProductAttributes(page: number = 0, size: number = 10, filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient.post<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/attributes/search`, {
            page: page,
            size: size,
            ...filter
        })
    }

    getSystemDefinedProductAttributes(filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient.get<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/system-attributes/search`, {
            params: {
                ...filter
            }
        })
    }

    getIntegrationDefinedProductAttributes(filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient.get<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/integration-attributes/search`, {
            params: {
                ...filter
            }
        })
    }


    // Group APIS
    getProductAttributeUserDefinedGroups(page: number = 0, size: number = 10, sort: string = null, order: 'asc' | 'desc' | '' | null = null, filter = null): Observable<EcommifyApiResponse<ProductUserDefinedAttributeGroupsResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        let body: any = {
            page: page,
            size: size,
        }
        if (sort && order) {
            body.sort = sort;
            body.order = order;
        }
        if (filter) {
            body = { ...body, ...filter };
        }

        return this._httpClient.post<EcommifyApiResponse<ProductUserDefinedAttributeGroupsResponse>>(`${api}/${companyID}/products/attribute-groups/search`, body)
            .pipe(
                tap(response => {
                    const { result } = response;
                    this._productAttributeGroupList.next(result.attribute_groups);
                })
            );
    }

    getProductAttributeSystemDefinedGroups(filter = null): Observable<EcommifyApiResponse<ProductUserDefinedAttributeGroupsResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        let body = {}
        if (filter) {
            body['params'] = { ...filter }
        }

        return this._httpClient.get<EcommifyApiResponse<ProductUserDefinedAttributeGroupsResponse>>(`${api}/${companyID}/products/system-groups`, body)
    }

    saveAttributeGroup(body, groupId: any = null) {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        const URL = groupId ? `${api}/${companyID}/products/attribute-groups/${groupId}` : `${api}/${companyID}/products/attribute-groups`
        const Method = groupId ? 'put' : 'post';

        return this._httpClient[Method]<EcommifyApiResponse<any>>(URL, body).pipe(
            catchError(error => {
                console.log('settings/product-attribute group: create/Update product attribute group error', error);
                return of(null);
            })
        );
    }

    // Utilities
    cloneAttributeObjectIntoGroup(attributeList, groupList, isSystemDefined: boolean = false, excluded_attributes: Array<any> = []) {
        const attributeMap = _.chain(attributeList).keyBy('code').value();
        console.log('group.attributes', groupList, excluded_attributes, attributeMap);
        groupList = groupList.map(group => {
            let internalMap = {};
            group['isSystemDefined'] = isSystemDefined;
            group.attribute_list = group.attributes;
            group.attributes = group.attributes.map(attr => {
                (attr in attributeMap && !excluded_attributes.includes(attr)) ? internalMap[attr] = attributeMap[attr] : null;
                attr = attr in attributeMap ? attributeMap[attr] : { code: attr, label: attr, custom: true };
                return attr;
            })
            group.attr_map = internalMap;
            console.log('attributeMap', group.attr_map);
            return group;
        })
        return groupList;
    }

    removeAttributeFromGroupByType(groupList, type: any) {
        groupList = groupList.map(group => {
            group.attributes = group.attributes.filter(attr => attr?.type != type);
            return group;
        })
        return groupList;
    }

    clearNull(arr) {
        return arr.filter(item => item != undefined && item != null && item != '');
    }

    convertBooleanToNumbers(arr: any, checkType: 'boolean' | 'value' = 'boolean', values: any = {}) {
        if (!Array.isArray(arr)) return arr;
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
}
