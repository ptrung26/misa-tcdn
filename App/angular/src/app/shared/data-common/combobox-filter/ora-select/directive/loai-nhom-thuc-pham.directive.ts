import {Directive, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {GIOI_TINH, LOAI_LAO_DONG, LOAI_NHOM_THUC_PHAM} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirLoaiNhomThucPham]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: LoaiNhomThucPhamDirective
        }
    ]
})
export class LoaiNhomThucPhamDirective implements ISelectOptions {
    options$ = of<ISelectOption[]>([]);

    constructor() {
        this.options$ = this.getDataSourceFromServer();
    }

    getDataSourceFromServer(): Observable<ISelectOption[]> {
        return of<ISelectOption[]>([
            {value: LOAI_NHOM_THUC_PHAM.RAU, displayText: 'Rau'},
            {value: LOAI_NHOM_THUC_PHAM.TRAI_CAY, displayText: 'Trái cây'},
            {value: LOAI_NHOM_THUC_PHAM.BANH_KEO, displayText: 'Bánh kẹo'},
            {value: LOAI_NHOM_THUC_PHAM.SUA, displayText: 'Sữa'},
            {value: LOAI_NHOM_THUC_PHAM.NUOC, displayText: 'Nước uống'},
            {value: LOAI_NHOM_THUC_PHAM.TP_GIAU_BOT_DUONG, displayText: 'Thực phẩm giàu bột đường'},
            {value: LOAI_NHOM_THUC_PHAM.TP_GIAU_DAM_BEO, displayText: 'Thực phẩm giàu đạm,chất béo'},
            {value: LOAI_NHOM_THUC_PHAM.GIA_VI_NUOC_CHAM, displayText: 'Gia vị, nước chấm'},
            {value: LOAI_NHOM_THUC_PHAM.DAU_MO, displayText: 'Dầu, mỡ, bơ'},
            {value: LOAI_NHOM_THUC_PHAM.KHAC, displayText: 'Khác'},
        ]);
    }

}
