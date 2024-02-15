import { Component, forwardRef, Injector, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, DinhDuongServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DonViDoComboComponent),
    multi: true
};

@Component({
    selector: 'don-vi-do-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear nzPlaceHolder="Chọn..."
                   (ngModelChange)='onChangeValue($event)'
                   [ngClass]="{'border-radius-left-0':borderLT0}"
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   style="width:100%"
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    styles: [`
        :host ::ng-deep .border-radius-left-0 .ant-select-selection {
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
        }
    `],
    providers: [VALUE_ACCESSOR]

})

export class DonViDoComboComponent extends AppComponentBase implements OnInit, ControlValueAccessor {

    _value = '';
    public optionList: any[] = [];
    public optionListSource: any[] = [];
    _isDisabled = false;
    @Input() loaiDonVi: any;
    @Input() borderLT0 = true;
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
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private _dataService: DinhDuongServiceProxy,
    ) {
        super(injector);
    }

    async ngOnInit() {
        const data = await this._comboboxService.getDonViDo();
        if (this.loaiDonVi) {
            // tslint:disable-next-line:triple-equals
            this.optionList = data.filter(item => item.loai == this.loaiDonVi);
        } else {
            this.optionList = data;
        }
        this.optionListSource = this.optionList;
    }

    onChangeValue(event: any): void {
        this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
        this.value = obj.toString();
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
