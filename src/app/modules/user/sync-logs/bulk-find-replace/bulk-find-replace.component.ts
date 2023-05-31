import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'eco-bulk-find-replace',
    templateUrl: './bulk-find-replace.component.html',
    styleUrls: ['./bulk-find-replace.component.scss']
})
export class BulkFindReplaceComponent implements OnInit {

    @Input() attributeList: any = [];

    findReplaceForm: any = {
        attribute: "",
        matchCase: false,
        findQuery: "",
        replaceQuery: ""
    };

    // Find & Replace Form Variables
    FR_AT_searchQuery: string;

    constructor() { }

    ngOnInit(): void {
    }

    resetForm() {
        this.findReplaceForm = {
            attribute: "",
            matchCase: false,
            findQuery: "",
            replaceQuery: ""
        };
    }

}
