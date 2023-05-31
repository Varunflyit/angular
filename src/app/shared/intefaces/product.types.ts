import { Pageable } from "app/layout/common/grid/grid.types";

export interface Product {
    id: Number;
    name: string;
    sku: string;
    created_at: string;
    updated_at: string;
    attributes: any;
    integration: any
}

export interface ProductAttribute {
    id?: Number;
    label: string;
    code: string;
    description: string;
    type: string;
    settings?: any;
    created_at: string;
    width?: number | string;
    attribute_type?: string;
}
export interface ProductAttributeGroup {
    id: any;
    company_id?: string;
    name: string;
    attributes: string[] | ProductAttribute[];
    attr_map?: { [key: string]: any; }; // Used for Internal Use
    position?: Number;
    created_at?: string;
    updated_at?: string;
}

export interface ProductAttributeListResponse extends Pageable {
    product_attributes: ProductAttribute[]
}

export interface ProductUserDefinedAttributeGroupsResponse extends Pageable {
    attribute_groups: ProductAttributeGroup[]
}
export interface ProductSystemAttributeGroupsResponse {
    attribute_groups: ProductAttributeGroup[]
}

