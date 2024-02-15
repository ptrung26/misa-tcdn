import {Directive, Input, OnChanges, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {mergeMap, map, filter, debounceTime} from 'rxjs/operators';
import {
    ISelectOption,
    ISelectOptions,
    SelectOptions
} from '@app/shared/data-common/combobox-filter/ora-select/model';
import {
    CommonLookupServiceProxy, DOI_TUONG_THUC_DON
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {BehaviorSubject} from '@node_modules/rxjs';

@Directive({
    selector: '[dirDoiTuongThucDon]',
    providers: [
        {
            provide: SelectOptions,
            useExisting: DoiTuongThucDonDirective
        }
    ]
})
export class DoiTuongThucDonDirective implements ISelectOptions, OnInit {
    options$: BehaviorSubject<ISelectOption[]> = new BehaviorSubject<ISelectOption[]>([]);
    key = 'list-doi-tuong-thuc-don';
    @Input() showItemVdv = true;

    constructor(private _dataService: CommonLookupServiceProxy,
                private _comboboxService: DataCommonService
    ) {

    }

    ngOnInit(): void {
        this.getDataSourceFromServer(this.showItemVdv);
    }

    getDataSourceFromServer(showItemVdv: boolean) {
        this._comboboxService.getComboboxDataObs(this.key, this._dataService.getListDoiTuongThucDon()
            .pipe(
                map(lst => lst.map(item => {
                        const res: ISelectOption = {
                            value: item.id,
                            displayText: item.name
                        };
                        return res;
                    })
                )))
            .pipe(
                debounceTime(1000),
                map((item) => item.filter(x => showItemVdv ? true : x.value !== DOI_TUONG_THUC_DON.VAN_DONG_VIEN)))
            .subscribe(result => {
                this.options$.next(result);
            });
    }

}
