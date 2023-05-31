import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

const ELEMENT_DATA: any[] = [
    {
        position: 1,
        name: 'Hydrogen',
        weight: 1.0079,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'H',
        price: 42,
        city: 'Mumbai',
        status: 'Draft',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415268',
        short_description: 'A quick brown fox jumps over the lazy dog',
        english_description: 'english_description	is abailable',
    },
    {
        position: 2,
        name: 'Helium',
        weight: 4.0026,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'He',
        price: 42,
        city: 'Pune',
        status: 'Draft',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        english_description: 'english_description	is abailable',
    },
    {
        position: 3,
        name: 'Lithium',
        weight: 6.941,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'Li',
        price: 42,
        city: 'Nashik',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        english_description: 'english_description	is abailable',
    },
    {
        position: 4,
        name: 'Beryllium',
        weight: 9.0122,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'Be',
        price: 42,
        city: 'Mumbai',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        english_description: 'english_description	is abailable',
        spanish_description: 'spanish_description spanish_description',
    },
    {
        position: 5,
        name: 'Boron',
        weight: 10.811,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'B',
        price: 42,
        city: 'Pune',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        spanish_description: 'spanish_description spanish_description',
    },
    {
        position: 6,
        name: 'Carbon',
        weight: 12.0107,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'C',
        price: 42,
        city: 'Aurangabad',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        spanish_description: 'spanish_description spanish_description',
    },
    {
        position: 7,
        name: 'Nitrogen',
        weight: 14.0067,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'N',
        price: 42,
        city: 'Goa',
        status: 'Draft',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        spanish_description: 'spanish_description spanish_description',
    },
    {
        position: 8,
        name: 'Oxygen',
        weight: 15.9994,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'O',
        price: 42,
        city: 'Belgaon',
        status: 'Draft',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287',
        short_description: 'A quick brown fox jumps over the lazy dog',
        spanish_description: 'spanish_description spanish_description',
    },
    {
        position: 9,
        name: 'Fluorine',
        weight: 18.9984,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'F',
        price: 42,
        city: 'Ahmednagar',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '415287365421564',
        short_description:
            'A quick brown fox jumps over the lazy dog A quick brown fox jumps over the lazy dog A quick brown fox jumps over the lazy dog A quick brown fox jumps over the lazy dog',
    },
    {
        position: 10,
        name: 'Neon',
        weight: 20.1797,
        thumbnail: '../../../../../assets/images/avatars/male-20.jpg',
        symbol: 'Ne',
        price: 42,
        city: 'Manmad',
        status: 'Completed',
        state: 'Maharashtra',
        country: 'India',
        pincode: '4152875465421654',
        short_description: 'A quick brown fox jumps over the lazy dog',
    },
];

@Component({
    selector: 'eco-select-sku-modal',
    templateUrl: './select-sku-modal.component.html',
    styleUrls: ['./select-sku-modal.component.scss']
})
export class SelectSkuModalComponent implements OnInit {

    showSelected: boolean = false;
    selection = new SelectionModel<any>(true, []);

    imagesExtension: string[] = ['.jpg', 'jpeg', 'png'];
    dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
    columnsToBeDisplayed: string[] = [
        'select',
        'position',
        'weight',
        'thumbnail',
        'name',
        'symbol',
        'state',
        'city',
        'status',
        'country',
        'pincode',
        'short_description',
        'english_description',
        'spanish_description',
    ];


    constructor(private dialogRef: MatDialogRef<SelectSkuModalComponent>) { }

    ngOnInit(): void {
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    isImage(data: any): boolean {
        if (typeof data === 'string') {
            return this.imagesExtension.some(extension => data.includes(extension));
        }
        return false;
    }

    changeColor(data: string): string {
        if (this.isImage(data)) {
            return null;
        } else {
            if (typeof data === 'string') {
                if (data.toLowerCase() === 'draft') {
                    return 'draft-status';
                } else if (data.toLowerCase() === 'completed') {
                    return 'completed-status';
                }
                return 'default-status;';
            }
        }
    }


    closeDialog(data: any = null) {
        this.dialogRef.close(data);
    }

    applyFilter(value: any) {

    }
}
