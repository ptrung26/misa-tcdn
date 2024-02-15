import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {GIOI_TINH, LOAI_LAO_DONG} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirSoBuaAn]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: SoBuaAnDirective
        }
    ]
})
export class SoBuaAnDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            {value: 3, displayText: '3 bữa'},
            {value: 4, displayText: '4 bữa'},
            {value: 5, displayText: '5 bữa'},
            {value: 6, displayText: '6 bữa'},
            {value: 7, displayText: '7 bữa'},
            {value: 8, displayText: '8 bữa'},
            {value: 9, displayText: '9 bữa'},
            {value: 10, displayText: '10 bữa'},
        ]);
    }

}
