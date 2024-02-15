import {Component, forwardRef, Injector, Input, OnChanges, OnInit, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    DanhMucDoTuoiDinhDuongServiceProxy, DoiTuongDinhDuongDto,
    DoiTuongDinhDuongServiceProxy
} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {IDataDdVaHC} from '@app/shared/data-common/combobox-filter/dinh-duong-va-hop-chat-combo.component';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DoiTuongDinhDuongComboComponent),
    multi: true
};


@Component({
    selector: 'doi-tuong-dinh-duong-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear nzPlaceHolder="Chọn..."
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   style="width:100%"
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.id"
                       [nzLabel]="option.tenHienThiAuto"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class DoiTuongDinhDuongComboComponent extends AppComponentBase implements OnInit, OnChanges, ControlValueAccessor {
    _value = 0;
    @Input() dinhDuongObj: IDataDdVaHC;
    public optionList: DoiTuongDinhDuongDto[] = [];
    public optionListSource: DoiTuongDinhDuongDto[] = [];
    _isDisabled = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    @Input()
    get value() {
        return this.value;
    }

    set value(v: any) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.tenHienThiAuto.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    constructor(
        injector: Injector,
        private  _dataService: DoiTuongDinhDuongServiceProxy,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.loadData(this.dinhDuongObj);
    }

    ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
        if (changes.dinhDuongObj.currentValue && !changes.dinhDuongObj.firstChange) {
            this.loadData(changes.dinhDuongObj.currentValue);
            this.onChangeValue(undefined);
        }
    }

    loadData(dinhDuongObj: IDataDdVaHC) {
        if (dinhDuongObj.dinhDuongId || dinhDuongObj.hopChatDinhDuongId) {
            let input: any = {
                ...dinhDuongObj
            };
            this._dataService.getAllByFilter(input).subscribe(result => {
                this.optionList = result;
                this.optionListSource = result;
            });
        } else {
            this.optionList = [];
            this.optionListSource = [];
        }

    }

    onChangeValue(event: any): void {
        this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
        this._value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

}
