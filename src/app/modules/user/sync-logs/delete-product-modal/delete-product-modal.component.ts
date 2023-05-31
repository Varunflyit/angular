import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductsService } from '../products/products.service';

@Component({
    selector: 'eco-delete-product-modal',
    templateUrl: './delete-product-modal.component.html',
    styleUrls: ['./delete-product-modal.component.scss']
})
export class DeleteProductModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public product_id: any,
        private dialogRef: MatDialogRef<DeleteProductModalComponent>,
        private _productService: ProductsService,
    ) { }

    ngOnInit(): void { }

    deleteProduct() {
        this._productService.deleteProduct(this.product_id.product_id).subscribe(response => {
            const { result } = response;
            this.closeDialog({isDelete: 1});
        }, error => {
            console.log(error);
        });
    }

    closeDialog(data: any = null) {
        this.dialogRef.close(data);
    }
}
