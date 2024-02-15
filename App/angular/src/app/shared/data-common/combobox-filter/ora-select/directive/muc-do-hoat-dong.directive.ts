import {Directive, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {mergeMap, map} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {LOAI_LAO_DONG, DOI_TUONG_THUC_DON} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirMucDoHD]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: MucDoHoatDongTLDirective
        }
    ]
})
export class MucDoHoatDongTLDirective implements ISelectOptions {
    @Input() set doiTuong(v: DOI_TUONG_THUC_DON) {
        this.$doiTuong.next(v);
    };

    $doiTuong = new BehaviorSubject<DOI_TUONG_THUC_DON>(DOI_TUONG_THUC_DON.NGUOI_BINH_THUONG);
    options$ = this.$doiTuong.pipe(map((dt) => {
        switch (dt) {
            case DOI_TUONG_THUC_DON.NGUOI_BINH_THUONG:
                return this.getList1();
            case DOI_TUONG_THUC_DON.PHU_NU_MANG_THAI:
                return this.getList1();
            case DOI_TUONG_THUC_DON.PHU_NU_CHO_CON_BU:
                return this.getList1();
            case DOI_TUONG_THUC_DON.VAN_DONG_VIEN:
                return this.getList1();
            case DOI_TUONG_THUC_DON.SUY_DINH_DUONG:
                return this.getList1();
            case DOI_TUONG_THUC_DON.BEO_PHI:
                return this.getList1();
            case DOI_TUONG_THUC_DON.DAI_THAO_DUONG:
                return this.getList2();
            case DOI_TUONG_THUC_DON.ROI_LOAN_MO_MAU:
                return this.getList2();
            case DOI_TUONG_THUC_DON.TANG_HUYET_AP:
                return this.getList2();
            case DOI_TUONG_THUC_DON.BENH_GOUT:
                return this.getList2();
            case DOI_TUONG_THUC_DON.SUY_THAN_MAN:
                return this.getList2();
            case DOI_TUONG_THUC_DON.SUY_THAN_GIAI_DOAN_CUOI:
                return this.getList2();
            case DOI_TUONG_THUC_DON.UNG_THU:
                return this.getList2();
        }
        return [];
    }));

    constructor() {
        // this.options$ = this.getDataSourceFromServer();
    }

    // getDataSourceFromServer(): Observable<ISelectOption[]> {
    //     return of<ISelectOption[]>([
    //         {value: LOAI_LAO_DONG.NHE, displayText: 'Nhẹ'},
    //         {value: LOAI_LAO_DONG.VUA, displayText: 'Trung bình'},
    //         {value: LOAI_LAO_DONG.NANG, displayText: 'Nặng'}
    //     ]);
    // }

    getList1() {
        return [
            {value: LOAI_LAO_DONG.NHE, displayText: 'Nhẹ'},
            {value: LOAI_LAO_DONG.VUA, displayText: 'Trung bình'},
            {value: LOAI_LAO_DONG.NANG, displayText: 'Nặng'}
        ];
    }

    getList2() {
        return [
            {value: LOAI_LAO_DONG.NAM_GIUONG, displayText: 'Nằm tại giường'},
            {value: LOAI_LAO_DONG.NHE, displayText: 'Nhẹ'},
            {value: LOAI_LAO_DONG.VUA, displayText: 'Trung bình'},
            {value: LOAI_LAO_DONG.NANG, displayText: 'Nặng'}
        ];
    }

}
