import {
    Component,
    OnInit,
    Provider,
    forwardRef,
    Input,
    Injector,
    Output,
    EventEmitter,
    OnChanges, OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    ComboboxItemDto,
    DanhMucHuyenServiceProxy,
    DanhMucTinhServiceProxy, DanhMucXaServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { of, Subject } from '@node_modules/rxjs';
import { debounceTime, switchMap, takeUntil } from '@node_modules/rxjs/internal/operators';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => XaComboComponent),
    multi: true,
};

@Component({
    selector: 'xa-combo',
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

export class XaComboComponent extends AppComponentBase implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() isDeleteTextXa = false;
    @Input() placeHolder = 'Chọn...';
    _value = '';
    @Input()
    get value() {
        return this._value;
    }

    set value(v: string) {
        this._value = v;
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        this._isDisabled = v;
    }

    public optionList: ComboboxItemDto[] = [];
    public optionListSource: ComboboxItemDto[] = [];
    _isDisabled = false;

    $maHuyen = new Subject<string>();

    @Input() set maHuyen(v: string) {
        this.$maHuyen.next(v);
    }

    $destroy = new Subject<boolean>();
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    constructor(
        injector: Injector,
        private _comboboxService: DanhMucXaServiceProxy,
        private _dataCommonService: DataCommonService,
    ) {
        super(injector);
        this.$maHuyen.pipe(
            switchMap((ma) => {
                if (ma) {
                    return this._dataCommonService.getComboboxDataObs('xa_' + ma, this._comboboxService.getComboBoxData(ma));
                } else {
                    return of([]);
                }
            }),
            takeUntil(this.$destroy),
            debounceTime(200),
        ).subscribe(result => {
            this.optionList = result;
            this.optionListSource = this.optionList;
            const itemFind = this.optionListSource.find(item => item.value === this.value);
            if (!itemFind) {
                this.value = null;
                this.onChangeValue(null);
            }
        });
    }


    search(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.optionList = this.optionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }

    ngOnInit() {

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


    writeValue(obj: string): void {
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
