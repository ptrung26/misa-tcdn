import {
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnChanges, OnDestroy,
    OnInit,
    Output,
    Provider,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    LOAI_NHOM_MON_AN,
    NhomMonAnDto,
    NhomMonAnServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { debounceTime, switchMap, takeUntil } from '@node_modules/rxjs/internal/operators';
import { BehaviorSubject, combineLatest, Subject } from '@node_modules/rxjs';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NhomMonAnComboComponent),
    multi: true,
};

interface ICbbNhomMonAn {
    displayText: string;
    value: number;
    loaiNhomMonAn: LOAI_NHOM_MON_AN | undefined
}

@Component({
    selector: 'nhom-mon-an-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear [nzPlaceHolder]="placeHolder"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   style="width:100%"
                   [nzMode]="mode"
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"
            ></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR],

})

export class NhomMonAnComboComponent extends AppComponentBase implements OnInit, OnDestroy, ControlValueAccessor {

    _value = [];
    $loadDataSource = new Subject();
    @Input() placeHolder = 'Chọn...';
    @Input() mode: 'default' | 'multiple' | 'tags' = 'default';
    @Input() loaiNhomMonAn: LOAI_NHOM_MON_AN;
    // @Input() listIdFilter: number[];
    @Input() chiLayCon = true; // chỉ lấy giá trị cuối cùng của nhánh

    public optionList: ICbbNhomMonAn[] = [];
    public optionListSource: ICbbNhomMonAn[] = [];
    _isDisabled = false;
    $destroy = new Subject<boolean>();
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
        private _service: NhomMonAnServiceProxy,
        private  _comboboxService: DataCommonService,
    ) {
        super(injector);

    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

    ngOnInit() {

        this.$loadDataSource.pipe(debounceTime(300), takeUntil(this.$destroy))
            .subscribe(() => {
                this.loaDataSource();
            });
        this.$loadDataSource.next();
        // this.loaDataSource();
    }

    loaDataSource() {
        // const key = 'nhom-mon-an_' + this._nguonDuLieu + '_' + this._tenantId;
        this._comboboxService.getComboboxDataObs('nhom-mon-an', this._service.comboBoxData())
            .pipe(debounceTime(300)).subscribe((res: NhomMonAnDto[]) => {
            // const result = this.chiLayCon ? this.getLeafItem(res) : res;
            this.optionList = res.map(item => {
                return {
                    displayText: item.tenVi,
                    value: item.id,
                    loaiNhomMonAn: item.loaiNhomMonAn,
                };
            });
            if (this.loaiNhomMonAn) {
                this.optionList = this.optionList.filter(x => x.loaiNhomMonAn === this.loaiNhomMonAn);
            }
            this.optionListSource = this.optionList;
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
