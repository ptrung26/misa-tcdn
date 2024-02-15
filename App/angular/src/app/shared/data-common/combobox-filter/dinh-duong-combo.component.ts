import {
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnInit,
    Output,
    Provider,
    TemplateRef
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    DinhDuongServiceProxy,
    GetDinhDuongVaCodeDinhDuongOutput
} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DinhDuongComboComponent),
    multi: true
};

@Component({
    selector: 'dinh-duong-combo',
    template: `
        <nz-select  [(ngModel)]="_value" nzAllowClear
                   nzPlaceHolder="Chọn..." style="width: 100%"
                   [nzMode]="nzMode"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   [nzNotFoundContent]="refNotFound"
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.id.toString()"
                       [nzLabel]="option.name"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class DinhDuongComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    @Input() hasNangLuong: boolean;
    @Input() isFixTenDinhDuong: boolean;
    @Input() nzMode: 'default' | 'multiple' | 'tags' = 'default';
    @Input() closeOnSelect = false;
    @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy...';
    _value = undefined;
    public optionList: GetDinhDuongVaCodeDinhDuongOutput[] = [];
    public optionListSource: GetDinhDuongVaCodeDinhDuongOutput[] = [];
    @Output() valueObj = new EventEmitter<GetDinhDuongVaCodeDinhDuongOutput>();
    _valueObj: GetDinhDuongVaCodeDinhDuongOutput = new GetDinhDuongVaCodeDinhDuongOutput();
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

    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.name.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }


    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private  _dataService: DinhDuongServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const that = this;
        this.optionListSource = await this._comboboxService.getComboboxData('danh-muc-dinh-duong', that._dataService.getDinhDuongVaCodeDinhDuong());
        if (this.hasNangLuong) {
            let nangLuongOpt = new GetDinhDuongVaCodeDinhDuongOutput();
            nangLuongOpt.id = -100;
            nangLuongOpt.name = `Năng lượng`;
            this.optionListSource = [
                nangLuongOpt,
                ...this.optionListSource
            ];
        }
        if (this.isFixTenDinhDuong) {
            this.optionListSource.forEach((it) => {
                if (it.codeDinhDuong === 30) {
                    it.name = 'Folate (Vitamin B9)';
                }
                if (it.codeDinhDuong === 31) {
                    it.name = 'Folic acid (Vitamin B9)';
                }
            });
        }
        this.optionList = this.optionListSource;
        this.setValueObj(this._value);
    }

    onChangeValue(event: any): void {
        this.setValueObj(event);
        this.valueObj.emit(this._valueObj);
        this.onChange(event);
    }

    setValueObj(dinhDuongId: any) {
        // tslint:disable-next-line:triple-equals
        this._valueObj = this.optionList.find(f => f.id == dinhDuongId);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
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
