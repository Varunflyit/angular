import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from 'app/core/config/app.config';
import { Pagination } from 'app/layout/common/grid/grid.types';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalStorageUtils } from 'app/core/common/local-storage.utils';
import { EcommifyApiResponse } from 'app/core/api/api.types';
import { GridUtils } from 'app/layout/common/grid/grid.utils';
import { Product, ProductAttribute, ProductAttributeGroup, ProductAttributeGroupsResponse, ProductAttributeListResponse, ProductFilterObject, ProductListResponse } from "./products.types";
import { SnackbarService } from 'app/shared/service/snackbar.service';
@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private _config = appConfig;
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
    private _productList: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
    private _productAttributeList: BehaviorSubject<ProductAttribute[] | null> = new BehaviorSubject(null);
    private _product_attribute_pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);
    private _productAttributeGroupList: BehaviorSubject<ProductAttributeGroup[] | null> = new BehaviorSubject(null);
    private _filteredProductAttributeListForTable: BehaviorSubject<ProductAttribute[] | null> = new BehaviorSubject(null);
    private _filteredProductAttributeListForFilterPanel: BehaviorSubject<ProductAttribute[] | null> = new BehaviorSubject(null);


    constructor(
        private _httpClient: HttpClient,
        private _snackbarService: SnackbarService
    ) { }

    /**
     * Getter Methods
     */

    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    get productList$(): Observable<Product[]> {
        return this._productList.asObservable();
    }

    get productAttributePagination$(): Observable<Pagination> {
        return this._product_attribute_pagination.asObservable();
    }

    get productAttributeList$(): Observable<ProductAttribute[]> {
        return this._productAttributeList.asObservable();
    }

    get filteredProductAttributeListForTable$(): Observable<ProductAttribute[]> {
        return this._filteredProductAttributeListForTable.asObservable();
    }


    /**
     * API Methods
     */

    getProducts(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: ProductFilterObject = null): Observable<EcommifyApiResponse<ProductListResponse>> {
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
        if (search) {
            body = { ...body, ...search };
        }
        return this._httpClient.post<EcommifyApiResponse<ProductListResponse>>(`${api}/${companyID}/products/search`, body).pipe(
            tap(response => {
                const { result } = response;
                const pagination = GridUtils.getPagination(result);
                this._pagination.next(pagination);
                this._productList.next(result.products);
                return result;
            })
        );
    }

    /**
    * Get Product Details
    * @param productID string
    * @method GET
    */
    getProductDetails(productID: string): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.get<EcommifyApiResponse<ProductListResponse>>(`${api}/${companyID}/product/${productID}`).pipe(
            tap(response => {
                return response;
            })
        );
    }

    /**
    * Update Product Details
    * @param productID string
    * @param productDetails Object
    * @method PUT
    */
    updateProductDetails(productID: string, productDetails): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.put<EcommifyApiResponse<ProductListResponse>>(`${api}/${companyID}/product/${productID}`, productDetails).pipe(
            tap(response => {
                this._snackbarService.showSuccess(response.message)
                return response;
            })
        );
    }

    /**
    * Get Files
    * @method GET
    */
    getFile(image_id): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.get<any>(`${api}/${companyID}/file/${image_id}`).pipe(
            tap(response => {
                // this._snackbarService.showSuccess(response.message)
                return response;
            })
        );
    }

    /**
    * Delete Product
    * @param productID string
    * @method DELETE
    */
    deleteProduct(productID: string): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.delete<EcommifyApiResponse<ProductListResponse>>(`${api}/${companyID}/product/${productID}`).pipe(
            tap(response => {
                this._snackbarService.showSuccess(response.message)
                return response;
            })
        );
    }

    /**
    * Get Completeness List
    * @param productID string
    * @method GET
    */
    getCompletenessList(productID: string): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.get<EcommifyApiResponse<ProductListResponse>>(`${api}/${companyID}/product/${productID}/completeness`).pipe(
            tap(response => {
                return response;
            })
        );
    }

    // /**
    // * Get Product Attributes
    // * @param page number
    // * @param size number
    // * @param filter object
    // * @method GET
    // */
    // getUserDefinedProductAttributes(page: number = 0, size: number = 10, filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
    //     const api = this._config?.apiConfig?.serviceUrlv1;
    //     const companyID = LocalStorageUtils.companyId;

    //     return this._httpClient.post<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/attributes/search`, {
    //         page: page,
    //         size: size,
    //         ...filter
    //     }).pipe(
    //         tap(response => {
    //             return response;
    //             // const { result } = response;
    //             // const pagination = GridUtils.getPagination(result);
    //             // this._product_attribute_pagination.next(pagination);
    //             // if (filter) {
    //             // if (callFromWhere == 'Table') {
    //             //     this._filteredProductAttributeListForTable.next(result.product_attributes);
    //             // } else if (callFromWhere == 'Filter') {
    //             //     this._filteredProductAttributeListForFilterPanel.next(result.product_attributes);
    //             // }
    //             // } else {
    //             // this._filteredProductAttributeListForTable.next(null);
    //             // this._filteredProductAttributeListForFilterPanel.next(null);
    //             // this._productAttributeList.next(result.product_attributes);
    //             // }
    //         })
    //     );
    // }

    // getSystemDefinedProductAttributes(filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
    //     const api = this._config?.apiConfig?.serviceUrlv1;
    //     const companyID = LocalStorageUtils.companyId;

    //     return this._httpClient.get<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/system-attributes/search`, {
    //         params: {
    //             ...filter
    //         }
    //     })
    // }

    // getIntegrationDefinedProductAttributes(filter = null): Observable<EcommifyApiResponse<ProductAttributeListResponse>> {
    //     const api = this._config?.apiConfig?.serviceUrlv1;
    //     const companyID = LocalStorageUtils.companyId;

    //     return this._httpClient.get<EcommifyApiResponse<ProductAttributeListResponse>>(`${api}/${companyID}/products/integration-attributes/search`, {
    //         params: {
    //             ...filter
    //         }
    //     })
    // }

    /**
    * Get Custom Attribute Groups
    * @param page number
    * @param size number
    * @method POST
    */
    getProductAttributeGroups(page: number = 0, size: number = 10): Observable<EcommifyApiResponse<ProductAttributeGroupsResponse>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;

        return this._httpClient.post<EcommifyApiResponse<ProductAttributeGroupsResponse>>(`${api}/${companyID}/products/attribute-groups/search`, {
            page: page,
            size: size
        })
            .pipe(
                tap(response => {
                    const { result } = response;
                    this._productAttributeGroupList.next(result.attribute_groups);
                    return response;
                })
            );
    }

    /**
     * Save Files
     * @param file Object
     * @method POST
     */
    saveFile(file): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.post<any>(`${api}/${companyID}/file`, file).pipe(
            tap(response => {
                const { result } = response;
                return result;
            })
        );
    }

    /**
     * Export Product Details
     * @param details Object
     * @method POST
     */
    exportDetails(details): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.post<any>(`${api}/${companyID}/exportRequest`, details).pipe(
            tap(response => {
                const { result } = response;
                return result;
            })
        );
    }

    saveUserSettings(data): Observable<EcommifyApiResponse<any>> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.post<EcommifyApiResponse<any>>(`${api}/${companyID}/settings`, data)
    }

    /**
     * Get Product Status
     * @method GET
     */
    getSystemSettings(): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.get<any>(`${api}/${companyID}/products/system-attributes/search`).pipe(
            tap(response => {
                return response;
            })
        );
    }

    getUserSettings(filter: any = {}): Observable<any> {
        const api = this._config?.apiConfig?.serviceUrlv1;
        const companyID = LocalStorageUtils.companyId;
        return this._httpClient.get<any>(`${api}/${companyID}/settings`, {
            params: {
                ...filter
            }
        })
    }


}
