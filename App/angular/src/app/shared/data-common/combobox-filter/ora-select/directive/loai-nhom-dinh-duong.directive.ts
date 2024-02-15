import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {GIOI_TINH, LOAI_LAO_DONG, LOAI_NHOM_DINH_DUONG} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirLoaiNhomDinhDuong]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiNhomDinhDuongDirective
        }
    ]
})
export class LoaiNhomDinhDuongDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            {value: LOAI_NHOM_DINH_DUONG.Macronutrients, displayText: 'Chất dinh dưỡng đa lượng'},
            {value: LOAI_NHOM_DINH_DUONG.Micronutrients, displayText: 'Chất dinh dưỡng vi lượng'},
            {value: LOAI_NHOM_DINH_DUONG.Aminogram, displayText: 'Các Axit amin'},
        ]);
    }

}
