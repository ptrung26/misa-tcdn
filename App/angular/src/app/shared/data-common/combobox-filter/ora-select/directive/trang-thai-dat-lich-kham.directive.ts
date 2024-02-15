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
    TRANG_THAI_DAT_LICH_KHAM,
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

@Directive({
    selector: '[dirTrangThaiDatLichKham]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: TrangThaiDatLichKhamDirective
        }
    ]
})
export class TrangThaiDatLichKhamDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);
    key = 'list-trang-thai-dat-lich-kham';

    constructor(private _dataService: CommonLookupServiceProxy,
                private _comboboxService: DataCommonService
                ) {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            { value: TRANG_THAI_DAT_LICH_KHAM.DAT_LICH, displayText: 'Đặt lịch' },
            { value: TRANG_THAI_DAT_LICH_KHAM.CHO_KHAM, displayText: 'Chờ khám' },
            { value: TRANG_THAI_DAT_LICH_KHAM.HOAN_THANH, displayText: 'Hoàn thành' },
            { value: TRANG_THAI_DAT_LICH_KHAM.HUY_LICH, displayText: 'Hủy lịch' },
        ]);
    }

}
