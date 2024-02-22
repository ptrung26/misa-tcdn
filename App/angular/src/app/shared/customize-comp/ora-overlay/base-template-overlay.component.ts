import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'base-template-overlay',
    templateUrl: './base-template-overlay.component.html',
})
export class BaseTemplateOverLayComponent implements OnInit {
    readonly visible$ = new Subject<boolean>();
    @ViewChild(TemplateRef, { static: true }) menuTemplate: TemplateRef<any>;
    constructor() {}
    ngOnInit(): void {
        console.log(this.menuTemplate);
    }
}
