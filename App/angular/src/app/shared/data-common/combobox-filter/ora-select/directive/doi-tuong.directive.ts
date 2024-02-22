import { Directive, Input, OnInit } from '@angular/core';
import { ISelectOption, ISelectOptions, SelectOptions } from '../model';
import { Observable, of } from 'rxjs';
import { DataCommonService } from '@app/shared/data-common/data-common.service';

@Directive({
    selector: '[doiTuongDirective]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: DoiTuongDirective,
        },
    ],
})
export class DoiTuongDirective implements ISelectOptions {
    options$: Observable<ISelectOption[]>;
    @Input() isShowItem: boolean = true;

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: 0, displayText: 'Nhà cung cấp' },
            { value: 1, displayText: 'Khách hàng' },
            { value: 2, displayText: 'Nhân viên' },
        ]);
    }
}
