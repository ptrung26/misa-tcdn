import { Directive } from '@angular/core';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';
import { Observable, of } from 'rxjs';

@Directive({
    selector: '[tinhChatDirective]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: TinhChatDirective,
        },
    ],
})
export class TinhChatDirective implements ISelectOptions {
    options$: Observable<ISelectOption[]>;

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: 0, displayText: 'Dư nợ' },
            { value: 1, displayText: 'Dư có' },
            { value: 2, displayText: 'Lưỡng tính' },
            { value: 3, displayText: 'Không có số dư' },
        ]);
    }
}
