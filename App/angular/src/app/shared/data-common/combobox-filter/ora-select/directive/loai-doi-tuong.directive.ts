import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';

// export enum LOAI_DOI_TUONG {
//     NGUOI_BINH_THUONG = 1,
//     TRE_CHUA_AN_COM = 2,
//     NGUOI_BENH = 3
// }

@Directive({
    selector: '[dirLoaiDoiTuong]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiDoiTuongDirective
        }
    ]
})
export class LoaiDoiTuongDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            // {value: LOAI_DOI_TUONG.NGUOI_BINH_THUONG, displayText: 'Người lớn'},
            // {value: LOAI_DOI_TUONG.TRE_CHUA_AN_COM, displayText: 'Trẻ em'},
        ]);
    }

}
