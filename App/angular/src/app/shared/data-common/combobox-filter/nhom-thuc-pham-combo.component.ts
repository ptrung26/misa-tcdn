import { Component, forwardRef, Injector, Input, OnDestroy, OnInit, Provider, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ComboboxItemDto, DanhMucNhomThucPhamServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { takeUntil } from '@node_modules/rxjs/internal/operators';
import { Subject } from '@node_modules/rxjs';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NhomThucPhamComboComponent),
    multi: true,
};

@Component({
    selector: 'nhom-thuc-pham-combo',
    template: `
        <nz-select [(ngModel)]="_value"
                   nzPlaceHolder="Chọn nhóm thực phẩm..."
                   #ref
                   [nzMode]="nzMode"
                   [nzAutoFocus]="true"
                   (ngModelChange)='onChangeValue($event);'
                   [nzDisabled]='_isDisabled'
                   [nzShowSearch]="true"
                   nzAutoClearSearchValue
                   nzShowArrow
                   nzAllowClear
                   [nzServerSearch]="true"
                   [nzNotFoundContent]="refNotFound"
                   (nzOnSearch)="search($event);"
                   style="width:100%">

            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR],


})

export class NhomThucPhamComboComponent extends AppComponentBase implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() nzMode: 'default' | 'multiple' | 'tags' = 'default';
    @Input() closeOnSelect = false;
    @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy nhóm TP...';
    $destroy = new Subject<boolean>();
    _value: any = undefined;
    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
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
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }


    constructor(
        injector: Injector,
        private _service: DanhMucNhomThucPhamServiceProxy,
        private  _comboboxService: DataCommonService,
    ) {
        super(injector);

    }


    ngOnInit() {
        this._comboboxService.getComboboxDataObs<ComboboxItemDto>('nhom-thuc-pham', this._service.getComboboxData())
            .pipe(takeUntil(this.$destroy))
            .subscribe(result => {
                this.optionList = result;
                this.optionList.forEach((it, idx) => {
                    it.displayText = `Nhóm ${idx + 1}: ${it.displayText}`;
                });
                this.optionListSource = this.optionList;
            });
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

    onChangeValue(event: any): void {
        this.onChange(event);

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
