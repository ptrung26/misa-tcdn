import {Component, forwardRef, Injector, Input, OnInit, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {DanhMucNgheNghiepServiceProxy, LinhVucNgheNghiepDto, ComboBoxGroupItemDto} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgheNghiepComboComponent),
    multi: true
};

@Component({
    selector: 'nghe-nghiep-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus($event)'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)"
                   [nzOptions]="optionList"
                   >
        </nz-select>
    `,
    styles: ['::ng-deep .ant-select-item-group { font-size: 13px; font-weight: bold; color: #006A6E }'],
    providers: [VALUE_ACCESSOR]

})

export class NgheNghiepComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    _value = '';
    public optionList: ComboBoxGroupItemDto[] = [];
    public optionListSource: ComboBoxGroupItemDto[] = [];
    _isDisabled = false;
    @Input() placeHolder;
    @Input() isDeleteTextNgheNghiep = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };


    @Input()
    get value() {
        return this._value;
    }

    set value(v: any) {
        if (typeof(v) === 'number') {
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
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.label.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
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
        this._dataService.comboBoxGroupData().subscribe(result => {
            this.optionList = result.data;
            this.optionListSource = this.optionList;
        });
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
