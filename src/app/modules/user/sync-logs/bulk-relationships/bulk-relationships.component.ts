import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
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
    selector: 'eco-bulk-relationships',
    templateUrl: './bulk-relationships.component.html',
    styleUrls: ['./bulk-relationships.component.scss']
})
export class BulkRelationshipsComponent implements OnInit {

    @Input() showProductTable: boolean = false;

    relationshipForm: any = {
        action: 'add',
        relationship: "",
        quantity: ""
    }

    selection = new SelectionModel<any>(false, []);

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

    constructor() { }

    ngOnInit(): void {
    }

    resetForm() {
        this.relationshipForm = {
            action: 'add',
            relationship: "",
            quantity: ""
        }
    }

    applyFilter(value: string) {
        console.log('apply filter :', value);
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

    next() {
        this.showProductTable = true;
        // API call Here to get product list
    }

}
