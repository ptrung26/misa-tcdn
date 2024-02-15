import {Directive, Input, OnChanges, OnInit} from '@angular/core';
import {Observable, of, BehaviorSubject} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {CHE_DO_AN, GIOI_TINH, LOAI_LAO_DONG} from '@shared/service-proxies/service-proxies';

@Directive({
    selector: '[dirCheDoAn]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: CheDoAnDirective
        }
    ]
})
export class CheDoAnDirective implements ISelectOptions, OnInit, OnChanges {


    // @Input() ngaySinh: Date;
    @Input() thangTuoi = 0;
    options$: BehaviorSubject<ISelectOption[]>;

    constructor() {
        this.options$ = new BehaviorSubject<ISelectOption[]>([]);
    }

    ngOnInit(): void {
        // this.options$ = this.getDataSourceFromServer();
        // this.ngaySinh$.subscribe(result => {
        //     this.options$ = this.getDataSourceFromServer(result);
        // });
        this.getDataSourceFromServer(this.thangTuoi);
    }

    ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
        if (changes.thangTuoi) {
            this.getDataSourceFromServer(changes.thangTuoi.currentValue);
        }
    }

    getDataSourceFromServer(thangTuoi: number) {
        // const thangTuoi = moment().diff(moment(ngaySinh), 'month');
        let res: ISelectOption[] = [];
        if (thangTuoi <= 6) {
            res = [
                {value: CHE_DO_AN.BuMeHoanToan, displayText: 'Bú sữa mẹ hoàn toàn'},
                {value: CHE_DO_AN.BuMe_SuaCT, displayText: 'Bú sữa mẹ + sữa công thức'},
                {value: CHE_DO_AN.ChiSuaCT, displayText: 'Chỉ dùng sữa công thức'},
            ];
        } else if (7 <= thangTuoi && thangTuoi <= 24) {
            res = [
                {value: CHE_DO_AN.AnDam_SuaMe, displayText: 'Ăn dặm + sữa mẹ'},
                {value: CHE_DO_AN.AnDam_SuaCT, displayText: 'Ăn dặm + sữa công thức'},
                {value: CHE_DO_AN.AnDam_SuaMe_SuaCT, displayText: 'Ăn dặm + Sữa mẹ + Sữa công thức'},
            ];
        } else {
            res = [
                {value: CHE_DO_AN.An_Chay, displayText: 'Ăn chay'},
                {value: CHE_DO_AN.An_3090_Thit, displayText: 'Ăn từ 30 - 90g thịt, cá... mỗi ngày'},
                {value: CHE_DO_AN.An_Tren_90Thit, displayText: 'Ăn > 90g thịt, cá... mỗi ngày'},
            ];
        }
        this.options$.next(res);
    }

}
