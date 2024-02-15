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
import {DataCommonService} from '@app/shared/data-common/data-common.service';

@Directive({
    selector: '[dirLoaiBuaAn]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiBuaAnDirective
        }
    ]
})
export class LoaiBuaAnDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    key = 'list-loai-bua-an';

    constructor(private _dataService: CommonLookupServiceProxy,
                private _comboboxService: DataCommonService
                ) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return this._comboboxService.getComboboxDataObs(this.key, this._dataService.getListLoaiBuaAn().pipe(map(lst => lst.map(item => {
            const res: ISelectOption = {
                value: item.id,
                displayText: item.name
            };
            return res;
        }))))
    }

}
