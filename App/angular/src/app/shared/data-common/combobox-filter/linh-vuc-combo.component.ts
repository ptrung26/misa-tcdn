import {Component, forwardRef, Injector, Input, OnInit, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {ComboboxItemDto, DanhMucNgheNghiepServiceProxy, LinhVucNgheNghiepDto} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LinhVucComboComponent),
    multi: true
};

@Component({
    selector: 'linh-vuc-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus($event)'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)"
                   >
            <nz-option *ngFor="let option of optionList" [nzValue]="option.id"
                       [nzLabel]="option.name"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class LinhVucComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    _value = '';
    public optionList: LinhVucNgheNghiepDto[] = [];
    public optionListSource: LinhVucNgheNghiepDto[] = [];
    _isDisabled = false;
    @Input() placeHolder = 'Chọn...';
    @Input() isDeleteTextLinhVuc = false;
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

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.name.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _dataService: DanhMucNgheNghiepServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const that = this;
        this._dataService.getNhomLinhVucNgheNghiep().subscribe(result => {
            this.optionList = result;
            this.optionListSource = result;
        });
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
