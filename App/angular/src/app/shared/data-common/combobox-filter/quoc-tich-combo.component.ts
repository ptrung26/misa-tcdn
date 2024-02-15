import { Component, forwardRef, Injector, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    DanhMucQuocTichServiceProxy,
    ReturnReponseOfIEnumerableOfComboboxItemDto,
} from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuocTichComboComponent),
    multi: true,
};

@Component({
    selector: 'quoc-tich-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR],

})

export class QuocTichComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    _value = '';
    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
    _isDisabled = false;
    @Input() placeHolder = 'Chọn...';
    @Input() isDeleteTextQuocTich = false;
    private onChange: Function = (v: any) => {
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

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _quoctichService: DanhMucQuocTichServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const that = this;
        let returnResponse: ReturnReponseOfIEnumerableOfComboboxItemDto;
        returnResponse = await this._comboboxService.getComboboxData('DanhMucQuocTich', that._quoctichService.comboBoxData());
        this.optionList = returnResponse.data;
        this.optionListSource = this.optionList;
    }

    onChangeValue(event: any): void {
        this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: string): void {
        this.value = obj;
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
