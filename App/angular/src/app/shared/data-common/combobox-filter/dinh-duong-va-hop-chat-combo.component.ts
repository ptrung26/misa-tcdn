import {Component, EventEmitter, forwardRef, Injector, Input, OnInit, Output, Provider} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    DinhDuongServiceProxy, ENUM_DINH_DUONG,
    GetDinhDuongVaCodeDinhDuongOutput,
    HopChatDinhDuongServiceProxy
} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';
import {DataCommonService} from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DinhDuongVaHopChatComboComponent),
    multi: true
};

export interface IDataDdVaHC {
    dinhDuongId?: any;
    hopChatDinhDuongId?: any;
    codeDinhDuong: ENUM_DINH_DUONG;
}

interface IDataDdVaHCOfList {
    name: string;
    value: IDataDdVaHC;
}

@Component({
    selector: 'dinh-duong-va-hop-chat-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear nzPlaceHolder="Chọn..." style="width: 100%"
                   [nzMode]="nzMode"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value.codeDinhDuong"
                       [nzLabel]="option.name"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class DinhDuongVaHopChatComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    @Input() isMulti: any;
    nzMode = 'default';
    _value: ENUM_DINH_DUONG = undefined;
    _valueObj: IDataDdVaHC = {
        codeDinhDuong: undefined,
        dinhDuongId: undefined,
        hopChatDinhDuongId: undefined,
    };
    public optionList: IDataDdVaHCOfList[] = [];
    public optionListSource: IDataDdVaHCOfList[] = [];
    _isDisabled = false;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };


    @Input()
    get value() {
        return this.value;
    }

    set value(v: IDataDdVaHC) {
        this._valueObj = v;
        this._value = v ? v.codeDinhDuong : undefined;
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
        private  _dinhDuongService: DinhDuongServiceProxy,
        private  _hcDinhDuongService: HopChatDinhDuongServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const that = this;
        const lst1: any[] = await this._comboboxService.getComboboxData('danh-muc-dinh-duong', that._dinhDuongService.getDinhDuongVaCodeDinhDuong());
        const lst2: any[] = await this._comboboxService.getComboboxData('danh-muc-hop-chat-dinh-duong', that._hcDinhDuongService.getHopChatDinhDuongVaCodeDinhDuong());
        const tran1 = lst1.map(item => {
            const res: IDataDdVaHCOfList = {
                name: item.name,
                value: {
                    dinhDuongId: item.id,
                    hopChatDinhDuongId: undefined,
                    codeDinhDuong: item.codeDinhDuong
                }
            };
            return res;
        });
        const tran2 = lst2.map(item => {
            const res: IDataDdVaHCOfList = {
                name: item.name,
                value: {
                    dinhDuongId: undefined,
                    hopChatDinhDuongId: item.id,
                    codeDinhDuong: item.codeDinhDuong
                }
            };
            return res;
        });
        this.optionList = tran1.concat(tran2);
        this.optionListSource = this.optionList;
        if (this.isMulti) {
            this.nzMode = 'multiple';
        }
    }

    onChangeValue(event: ENUM_DINH_DUONG): void {
        if (event) {
            const item: IDataDdVaHCOfList = this.optionList.find(x => x.value.codeDinhDuong === event);
            this.onChange(item.value);
            this._valueObj = item.value;
        } else {
            this.onChange({});
            this._valueObj = {
                codeDinhDuong: undefined,
                dinhDuongId: undefined,
                hopChatDinhDuongId: undefined,
            };
        }
    }


    onFocus(event: IDataDdVaHC): void {
        this.onTouched();
    }


    writeValue(obj: IDataDdVaHC): void {
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
