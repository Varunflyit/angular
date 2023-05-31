import { Directive, OnInit, Renderer2, Input, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[resizeColumn]'
})
export class ResizeColumnDirective implements OnInit {
    @Input('resizeColumn') resizable: boolean;

    @Input() index: number;
    // @Input() tableWidth: number;
    // @Input() maxTableWidthToScreen: number;

    @Output() onColumnResize: EventEmitter<any> = new EventEmitter();

    private startX: number;

    private startWidth: number;

    private finalWidth: number;

    private column: HTMLElement;

    private table: HTMLElement;

    // private finalTableWidth = 0;

    private pressed: boolean;

    private _resizableMatCells: any[];

    private _overlayMatCells: any[];

    constructor(private renderer: Renderer2, private el: ElementRef) {
        this.column = this.el.nativeElement;
    }

    ngOnInit() {
        if (this.resizable) {
            const row = this.renderer.parentNode(this.column);
            const thead = this.renderer.parentNode(row);
            this.table = this.renderer.parentNode(thead);
            // this.finalTableWidth += this.tableWidth;
            // this.renderer.setStyle(this.table, 'width', `${this.finalTableWidth < this.maxTableWidthToScreen ? this.maxTableWidthToScreen : (this.finalTableWidth + 200)}px`);
            // this.renderer.setStyle(this.table, 'min-width', `${this.finalTableWidth < this.maxTableWidthToScreen ? this.maxTableWidthToScreen : (this.finalTableWidth + 200)}px`);

            const resizer = this.renderer.createElement('span');
            this.renderer.addClass(resizer, 'resize-holder');
            this.renderer.appendChild(this.column, resizer);
            this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
            this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
            this.renderer.listen('document', 'mouseup', this.onMouseUp);
            this.renderer.listen('document', 'contextmenu', this.onContextMenu);
        }
    }

    onMouseDown = (event: MouseEvent) => {
        if (event.button == 0) {
            this.pressed = true;
            this.startX = event.pageX;
            this.startWidth = this.column.offsetWidth;
            // this._resizableMatCells = Array.from(this.table.querySelectorAll('.mat-row')).map(
            //     (row: any) => row.querySelectorAll('.mat-cell').item(this.index)
            // );
            this.removePlaceholders();
            this.addPlaceholder(event);
        }

    };

    onMouseMove = (event: MouseEvent) => {
        const offset = 0;
        if (this.pressed && event.buttons && event.button == 0) {
            this.renderer.addClass(this.table, 'resizing');

            // Calculate width of column
            let width = this.startWidth + (event.pageX - this.startX - offset);
            this.finalWidth = width;

            // Set table header width
            this.renderer.setStyle(this.column, 'width', `${width}px`);

            // Set table cells width
            for (const cell of this._overlayMatCells) {
                this.renderer.setStyle(cell, 'width', `${width}px`);
            }
        }
    };

    onMouseUp = (event: MouseEvent) => {
        if (this.pressed) {
            this.onColumnResize.next({ index: this.index, width: this.finalWidth });
            this.pressed = false;
            this.renderer.removeClass(this.table, 'resizing');
            this.removePlaceholders();
        }
    };

    onContextMenu = (event: MouseEvent) => {
        this.onColumnResize.next({ index: this.index, width: this.finalWidth });
        this.pressed = false;
        this.renderer.removeClass(this.table, 'resizing');
        this.removePlaceholders();
    }

    async addPlaceholder(event: any) {
        // Header
        const overlay = this.renderer.createElement('div');
        this.renderer.addClass(overlay, 'mat-column-overlay');
        this.renderer.appendChild(this.column, overlay);

        // Data Cell
        this._resizableMatCells = document.querySelectorAll(`.mat-cell:nth-child(${this.index + 1})`) as any;
        this._resizableMatCells.forEach(cell => {
            const overlay = this.renderer.createElement('div');
            this.renderer.addClass(overlay, 'mat-column-overlay');
            this.renderer.setStyle(cell, 'position', 'relative');
            this.renderer.appendChild(cell, overlay);
        });

        this._overlayMatCells = document.querySelectorAll(".mat-column-overlay") as any;
    }

    removePlaceholders() {
        this._overlayMatCells = document.querySelectorAll(".mat-column-overlay") as any;
        this._overlayMatCells.forEach(cellOverlay => {
            cellOverlay.remove();
        })

        if (this._resizableMatCells?.length > 0) {
            this._resizableMatCells.forEach(cell => {
                this.renderer.removeStyle(cell, 'position');
            })
        }
        this._overlayMatCells = [];
    }
}
