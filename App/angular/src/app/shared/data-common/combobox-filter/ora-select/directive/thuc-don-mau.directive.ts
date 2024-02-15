import { Directive, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions,
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {
    CommonLookupServiceProxy,
    GIOI_TINH,
    LOAI_LAO_DONG,
    LOAI_THOI_GIAN, ThucDonMauServiceProxy,
} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirThucDonMau]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: ThucDonMauDirective,
        },
    ],
})
export class ThucDonMauDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor(private _dataService: ThucDonMauServiceProxy) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        // return  this._dataService.getListThucDonMau(999, 0).pipe(map(lst => lst.items.map(item => {
        //     const res: ISelectOption = {
        //         value: item.id,
        //         displayText: item.tenThucDon
        //     };
        //     return res;
        // })));
        return of([]);
    }

}
