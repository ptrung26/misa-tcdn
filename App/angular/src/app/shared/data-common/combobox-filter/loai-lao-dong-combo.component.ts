import {Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {ComboboxItemDto, DanhMucNhomThucPhamServiceProxy, LOAI_LAO_DONG} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LoaiLaoDongComboComponent),
    multi: true
};

@Component({
    selector: 'loai-lao-dong-combo',
    template: `
        <nz-select [(ngModel)]="_value" (ngModelChange)='onChangeValue($event)' nzAllowClear>
            <nz-option nzLabel="Nhẹ" [nzValue]="loaiLaoDong.NHE"></nz-option>
            <nz-option nzLabel="Vừa" [nzValue]="loaiLaoDong.VUA"></nz-option>
            <nz-option nzLabel="Nặng" [nzValue]="loaiLaoDong.NANG"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class LoaiLaoDongComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    _value = 0;
    loaiLaoDong = LOAI_LAO_DONG;
    _isDisabled = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    @Input()
    get value() {
        return this._value;
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

    constructor(
        injector: Injector,
        private _service: DanhMucNhomThucPhamServiceProxy,
        private  _comboboxService: DataCommonService
    ) {
        super(injector);

    }

    async ngOnInit() {
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
