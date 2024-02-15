import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input, OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Provider
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    KichThuocKhauPhan_MonAnDto,
    KichThuocKhauPhan_ThucPhamDto, MonAnServiceProxy,
    ThucPhamServiceProxy
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {
    debounceTime,
    distinctUntilChanged,
    mergeMap,
    pairwise,
    switchMap,
    takeUntil,
    map, tap
} from '@node_modules/rxjs/operators';
import {BehaviorSubject, combineLatest, from, Observable, of, Subject} from '@node_modules/rxjs';
import {$e} from '@node_modules/codelyzer/angular/styles/chars';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => KichThuocKhauPhanMaComboComponent),
    multi: true
};

@Component({
    selector: 'kich-thuoc-khau-phan-ma-combo',
    template: `
        <nz-select *ngIf="isEditMode" [formControl]="formControl" nzPlaceHolder="g"
                   (nzOpenChange)="nzOpenChange($event)"
                   [nzAllowClear]='nzAllowClear'
                   [nzDisabled]='_isDisabled'
                   (nzFocus)='onFocus($event)'
                   style="width:100%">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.id"
                       [nzDisabled]="option.id===-100"
                       [nzLabel]="option.tenDonVi">
            </nz-option>
        </nz-select>
        <span *ngIf="!isEditMode">
           {{_itemSelected?.id === -100 ? 'g' : _itemSelected?.tenDonVi}}
        </span>
    `,
    styles: [`

    `],
    providers: [VALUE_ACCESSOR]

})

export class KichThuocKhauPhanMaComboComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, OnChanges {
    formControl: FormControl = new FormControl();
    public optionList: KichThuocKhauPhan_MonAnDto[] = [];
    public optionListSource: KichThuocKhauPhan_MonAnDto[] = [];
    prevValue: any;
    _isDisabled = false;
    controlKey = '';
    @Input() allowAddItemMl = false;
    @Input() isEditMode = true;
    @Input() monAnId: number;
    @Input() nzAllowClear = false;
    @Output() onItemSelected = new EventEmitter<KichThuocKhauPhan_MonAnDto>();
    alowEmitItemSeleted = false; // Nếu true: sẽ  emit onItemSelected ; ngược lại sẽ không emit
    @Output() onOpenChange = new EventEmitter<boolean>();
    onWrireValue$: Subject<any> = new Subject<any>();
    onCallItemSelect$: Subject<any> = new Subject<any>();
    $destroy: Subject<boolean> = new Subject<boolean>();
    _itemSelected: KichThuocKhauPhan_MonAnDto = new KichThuocKhauPhan_MonAnDto();
    $dataSource: Subject<KichThuocKhauPhan_MonAnDto[]> = new Subject<KichThuocKhauPhan_MonAnDto[]>();
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    @Input()
    get value() {
        return this.formControl.value;
    }

    set value(v: any) {
        if (!v) {
            this.formControl.setValue(-1);
        } else {
            this.formControl.setValue(v);
        }
    }

    getItemSelect(id: any) {
        if (this.optionListSource && this.optionListSource.length > 0) {
            // tslint:disable-next-line:triple-equals
            const findItem = this.optionListSource.find(x => x.id == id);
            this._itemSelected = findItem;
            if (this.alowEmitItemSeleted === true) {
                if (findItem) {
                    // findItem.id = findItem.id === -1 ? undefined : findItem.id;
                    this.onItemSelected.emit(findItem);
                } else {
                    this.onItemSelected.emit(undefined);
                }
            }
            this.alowEmitItemSeleted = true;
        }
    }

    getTextOption(option: KichThuocKhauPhan_MonAnDto): string {
        if (option.id >= 0) {
            const ext = ' (' + option.khoiLuong + ' g)';
            return option.tenDonVi + ext;
        } else {
            return option.tenDonVi;
        }
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
        private _comboboxService: DataCommonService,
        private _dataService: MonAnServiceProxy,
    ) {
        super(injector);
        this.controlKey = this.guid();
        combineLatest([
            this.onWrireValue$.pipe(distinctUntilChanged(), debounceTime(100),
                switchMap((value) => of(value))),
            this.$dataSource.pipe(debounceTime(200),
                switchMap((value) => of(value))
            )
        ]).pipe(takeUntil(this.$destroy)).subscribe(([resultValue, resultCbb]) => {
            let tempList = [];
            const itemFirst = new KichThuocKhauPhan_MonAnDto();
            itemFirst.id = -1;
            itemFirst.monAnId = this.monAnId;
            itemFirst.khoiLuong = 1;
            itemFirst.tenDonVi = 'g';
            itemFirst.isDelete = false;
            tempList.push(itemFirst);
            tempList = tempList.concat(resultCbb);
            if (this.allowAddItemMl) {
                const item2 = new KichThuocKhauPhan_MonAnDto();
                item2.id = -99;
                item2.monAnId = this.monAnId;
                item2.khoiLuong = 1;
                item2.tenDonVi = 'ml';
                item2.isDelete = false;
                tempList.push(item2);
            }
            const itemLast = new KichThuocKhauPhan_MonAnDto();
            itemLast.id = -100;
            itemLast.monAnId = this.monAnId;
            itemLast.khoiLuong = 1;
            itemLast.tenDonVi = 'Tùy chỉnh(g)';
            itemLast.isDelete = false;
            tempList.push(itemLast);
            this.optionList = tempList;
            this.optionListSource = this.optionList;

            this.formControl.setValue(resultValue ? resultValue : -1); //new FormControl(resultValue ? resultValue : -1);
            this.onChange(resultValue ? resultValue : -1);
            this.onCallItemSelect$.next(resultValue ? resultValue : -1);
        });
    }

    ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
        if (changes.monAnId.currentValue) {
            this.reloadDataSource(changes.monAnId.currentValue);
        }
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    reloadDataSource(monAnId: number) {
        this._itemSelected.id = -1;
        this._itemSelected.monAnId = monAnId;
        this._itemSelected.khoiLuong = 1;
        this._itemSelected.tenDonVi = 'g';
        this._itemSelected.isDelete = false;
        if (monAnId) {
            this._comboboxService.getComboboxDataObs('kt-khau-phan-ma_' + monAnId,
                this._dataService.getAllKichThuocKhauPhan_MonAn(monAnId), false)
                .pipe(debounceTime(300))
                .subscribe(result => {
                    this.$dataSource.next(result);
                });
        } else {
            this.$dataSource.next([]);
        }

    }

    ngOnInit() {

        this.formControl.valueChanges.pipe(takeUntil(this.$destroy),
            distinctUntilChanged(),
            debounceTime(100),
            pairwise()
        ).subscribe(([prev, next]) => {
            this.prevValue = prev;
            this.onWrireValue$.next(next ? next : -1);
            // this.onChange(next);
            // this.onCallItemSelect$.next(next);
        });
        this.onCallItemSelect$.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100), switchMap((item) => of(item)))
            .subscribe(result => {
                this.getItemSelect(result ? result : -1);
            });
    }

    rollbackPreValue() {
        this.alowEmitItemSeleted = false;
        this.formControl.setValue(this.prevValue);
    }

    private guid(): string {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    nzOpenChange($event: boolean) {
        this.onOpenChange.emit($event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
        this.onWrireValue$.next(obj ? obj : -1);
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


}
