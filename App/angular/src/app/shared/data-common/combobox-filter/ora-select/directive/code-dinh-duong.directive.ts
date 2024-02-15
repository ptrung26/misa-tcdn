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
    GIOI_TINH,
    LOAI_LAO_DONG,
    LOAI_THOI_GIAN
} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirCodeDinhDuong]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: CodeDinhDuongDirective
        }
    ]
})
export class CodeDinhDuongDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor(private _dataService: CommonLookupServiceProxy) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return  this._dataService.getAllCodeDinhDuong().pipe(map(lst => lst.map(item => {
            const res: ISelectOption = {
                value: item.id,
                displayText: item.name
            };
            return res;
        })));
    }

}
