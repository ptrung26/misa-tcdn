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
    LOAI_LICH_HEN,
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

@Directive({
    selector: '[dirLoaiLichHen]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiLichHenDirective
        }
    ]
})
export class LoaiLichHenDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    key = 'list-loai-lich-hen';

    constructor(private _dataService: CommonLookupServiceProxy,
                private _comboboxService: DataCommonService
                ) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
          { value: LOAI_LICH_HEN.HEN_KHAM_MOI, displayText: 'Hẹn khám mới' },
          { value: LOAI_LICH_HEN.HEN_KHAM_LAI, displayText: 'Hẹn khám lại' },
        ]);
      }

}
