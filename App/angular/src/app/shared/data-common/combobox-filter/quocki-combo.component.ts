import {Component, EventEmitter, forwardRef, Injector, Input, OnDestroy, OnInit, Output, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    ThanhVienServiceProxy
} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {map, takeUntil} from 'rxjs/operators';
import {combineLatest, Subject} from '@node_modules/rxjs';

class ComboboxItemQuocKyDto extends ComboboxItemDto {
    imgFlagClass: string;
}

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuocKiComboComponent),
    multi: true
};

@Component({
    selector: 'quoc-ki-combo',
    template: `

        <div class="selected-flag" id="flag-icon"></div>
        <nz-select style="width:100%" [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)"
                   [compareWith]="compareFn"
                   [nzCustomTemplate]="defaultTemplate"
        >
            <ng-template #defaultTemplate let-selected>
            <!-- imgFlagClass -->
                <i nz-icon [ngClass]="['anticon', selected.nzValue.imgFlagClass]"></i> {{ selected.nzValue.value }} </ng-template>
            <nz-option nzCustomContent
                       *ngFor="let option of optionList"
                       [nzValue]="option"
                       [nzLabel]="option.displayText">
                <!-- <i nz-icon [ngClass]="option.imgFlagClass"></i> -->
                <i nz-icon [ngClass]="['anticon', option.imgFlagClass]"></i> 
                {{ option.displayText }}
            </nz-option>
        </nz-select>
        
    `,
    styles: [`
        ::ng-deep .ant-select-dropdown {
            width: 350px;
        }

        ::ng-deep .ant-input-group-addon:first-child {
            padding: 0;
        }

        ::ng-deep .ant-input-group-addon .ant-select {
            margin: -2px -5px;
        }

        ::ng-deep .ant-input-group-addon .ant-select.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
            margin-left: 0;
        }
    `

    ],
    providers: [VALUE_ACCESSOR]

})

export class QuocKiComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor, OnDestroy {

    _value = '';
    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
    _isDisabled = false;
    @Input() placeHolder = 'Chọn...';
    @Input() isDeleteTextQuocTich = false;
    _itemSelect: ComboboxItemDto = new ComboboxItemDto();
    @Output() onItemSelected = new EventEmitter<ComboboxItemDto>();

    onWrireValue$: Subject<string> = new Subject<string>();
    destroy$ = new Subject<boolean>();
    public onChange: Function = (event: any) => {

    };
    private onTouched: Function = () => {
    };


    @Input()
    get value() {
        return this._value;
    }

    set value(v: any) {
        if (typeof (v) === 'number') {
            this._value = v.toString();
        } else {
            this._value = v;
        }

    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    compareFn = (o1: ComboboxItemQuocKyDto, o2: ComboboxItemQuocKyDto) => (o1 && o2 ? o1.value === o2.value : o1 === o2);

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) =>
            (AppUtilityService.removeDau(s.value.toLowerCase()).indexOf(value.toLowerCase()) !== -1) ||
            (AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1)
        );
    }

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _thanhVienService: ThanhVienServiceProxy,
    ) {
        super(injector);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

    ngOnInit() {
        combineLatest([
            this.onWrireValue$,
            //list-quoc-ky
            this._comboboxService.getComboboxDataObs('list-quoc-ky-dau-so', this._thanhVienService.comboBoxData()
                .pipe(map((item) => item.data)))
                .pipe(map((item: ComboboxItemDto[]) => {
                    const res = item.map(item => {
                        return this.getCountryInfo(item.value, item.displayText);
                    }).filter(x => x && x.value !== undefined);
                    return res;
                }))
        ]).pipe(takeUntil(this.destroy$))
            .subscribe(([value, result]) => {
                this.value = value;
                this.optionList = result;
                this.optionListSource = result;
                this.value = result.find(x => x.value === value);
            });
        
        // this._thanhVienService.comboBoxData().pipe(takeUntil(this.destroy$))
        //     .subscribe((result) => {
        //         this.optionList = result.data;
        //         this.optionListSource = result.data;
        //     });
    }

    private getCountryInfo(value: string, displayText: string): ComboboxItemQuocKyDto {
        if (displayText !== '') {
            let countryCode = displayText.split(' ')[1];
            if (countryCode) {
                const res = new ComboboxItemQuocKyDto();
                res.displayText = `${countryCode} (${value})`;
                res.value = value;
                res.imgFlagClass = displayText;
                return res;
            } else {
                return;
            }
        }
    }

    onChangeValue(event: ComboboxItemQuocKyDto): void {
        this.onChange(event ? event.value : '');
        this._itemSelect = event;
        this.onItemSelected.emit(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }

    writeValue(obj: string): void {
        this.onWrireValue$.next(obj);
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
