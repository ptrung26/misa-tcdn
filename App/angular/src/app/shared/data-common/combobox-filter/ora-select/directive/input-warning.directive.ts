import { Directive, OnInit } from '@angular/core';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';
import { Observable, of } from 'rxjs';

@Directive({
    selector: '[inputWarningDirective]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: InputWarningDirective,
        },
    ],
})
export class InputWarningDirective implements ISelectOptions {
    options$: Observable<ISelectOption[]>;
    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: 0, displayText: 'Chỉ cảnh báo' },
            { value: 1, displayText: 'Bắt buộc nhập' },
        ]);
    }
}
