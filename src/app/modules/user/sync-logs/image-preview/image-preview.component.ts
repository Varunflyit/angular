import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { createPopper } from "@popperjs/core";

@Component({
    selector: 'eco-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {

    @Input() image: string;
    @Input() cssClass: string;

    randomId = "";

    constructor(private ren: Renderer2) {
        this.randomId = Date.now().toString() + Math.round(Math.random() * 10000).toString();
    }

    ngOnInit(): void {
        setTimeout(() => {
            var timeout = null;
            const button = document.querySelector(`#button${this.randomId}`);
            const tooltip = document.querySelector<any>(`#tooltip${this.randomId}`);

            let popperInstance = null;

            function create() {
                popperInstance = createPopper(button, tooltip, {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 8],
                            },
                        },
                    ],
                    placement: 'right-start',
                });
            }

            function destroy() {
                if (popperInstance) {
                    popperInstance.destroy();
                    popperInstance = null;
                }
            }

            function show() {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    tooltip.setAttribute('data-show', '');
                    create();
                }, 100);
            }

            function hide() {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => {
                    tooltip.removeAttribute('data-show');
                    destroy();
                }, 100);
            }

            button.addEventListener('mouseenter', show);
            button.addEventListener('mouseleave', hide);
        }, 100);
    }

}
