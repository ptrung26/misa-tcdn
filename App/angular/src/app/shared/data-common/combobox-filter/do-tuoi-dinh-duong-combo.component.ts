import {Component, forwardRef, Injector, Input, OnInit, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {ComboboxItemDto, DanhMucDoTuoiDinhDuongServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DoTuoiDinhDuongComboComponent),
    multi: true
};

@Component({
    selector: 'do-tuoi-dd-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear nzPlaceHolder="Chọn..."
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   style="width:100%"
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class DoTuoiDinhDuongComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    _value = 0;
    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
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
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _dataService: DanhMucDoTuoiDinhDuongServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const that = this;
        this.optionList = await this._comboboxService.getComboboxData('do-tuoi-dd', that._dataService.comboBoxData());
        this.optionListSource = this.optionList;
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
