import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';


interface FoodNode {
    name: string;
    children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
    {
        name: 'Fruit',
        children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
    },
    {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
            },
            {
                name: 'Orange',
                children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
            },
        ],
    },
];


@Component({
    selector: 'eco-bulk-categories',
    templateUrl: './bulk-categories.component.html',
    styleUrls: ['./bulk-categories.component.scss']
})
export class BulkCategoriesComponent implements OnInit {

    actionDropdownOptions: any = [
        { label: 'Add Categories', title: 'Include the products in the selected categories.', value: 'add' },
        { label: 'Replace Categories', title: 'Overwrite product categories from the selection.', value: 'replace' },
        { label: 'Remove Cattegories', title: 'Remove the products from the selected categories.', value: 'remove' }
    ]
    categoryForm: any = {
        action: this.actionDropdownOptions[0],
        selectedCategories: []
    }

    treeControl = new NestedTreeControl<FoodNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<FoodNode>();


    /** The selection for checklist */
    checklistSelection = new SelectionModel<FoodNode>(
        true /* multiple */
    );

    constructor() {
        this.dataSource.data = TREE_DATA;
    }

    ngOnInit(): void {
    }

    hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

    selectionToggle(node: FoodNode): void {
        this.checklistSelection.toggle(node);
        this.refreshSelectedCategory(this.checklistSelection.selected);
        console.log('this.checklistSelection.selected', this.categoryForm.selectedCategories);
    }

    leafItemSelectionToggle(node: FoodNode): void {
        this.checklistSelection.toggle(node);
        this.refreshSelectedCategory(this.checklistSelection.selected);
        console.log('this.checklistSelection.selected', this.categoryForm.selectedCategories);
    }

    getParent(array, name) {
        if (typeof array != "undefined") {
            for (let i = 0; i < array.length; i++) {
                if (array[i].name === name) {
                    return [array[i]];
                }
                const a = this.getParent(array[i].children, name);
                if (a !== null) {
                    a.unshift(array[i]);
                    return a;
                }
            }
        }
        return null;
    }

    refreshSelectedCategory(selected) {
        console.log('selected', selected);
        this.categoryForm.selectedCategories = [];
        selected.forEach(element => {
            const parents = this.getParent(this.dataSource.data, element.name);
            console.log('parents', parents);
            this.categoryForm.selectedCategories.push(parents);
        });
    }

    unSelectCategory(index) {
        let item = this.categoryForm.selectedCategories[index];
        let length = item.length;
        this.checklistSelection.toggle(item[length - 1]);
        this.refreshSelectedCategory(this.checklistSelection.selected);
    }

    clearAllSelection() {
        this.categoryForm.selectedCategories.forEach(element => {
            this.checklistSelection.toggle(element[element.length - 1]);
        });
        this.refreshSelectedCategory(this.checklistSelection.selected);
    }
}
