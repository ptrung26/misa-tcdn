import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap, map} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {
    CommonLookupServiceProxy,
} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirLoaiNhomMonAn]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiNhomMonAnDirective
        }
    ]
})
export class LoaiNhomMonAnDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor(private _dataService: CommonLookupServiceProxy) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return  this._dataService.getListLoaiNhomMonAn().pipe(map(lst => lst.map(item => {
            const res: ISelectOption = {
                value: item.id,
                displayText: item.name
            };
            return res;
        })));
    }

}
