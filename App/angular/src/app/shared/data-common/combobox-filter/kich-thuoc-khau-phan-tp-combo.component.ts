import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Provider, ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    KichThuocKhauPhan_ThucPhamDto,
    ThucPhamServiceProxy
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {debounceTime, distinctUntilChanged, mergeMap, switchMap, takeUntil, tap} from '@node_modules/rxjs/operators';
import {combineLatest, concat, from, Observable, of, Subject} from '@node_modules/rxjs';
import {$e} from '@node_modules/codelyzer/angular/styles/chars';
import { NzSelectComponent } from '@node_modules/ng-zorro-antd/select';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => KichThuocKhauPhanTpComboComponent),
    multi: true
};


@Component({
    selector: 'kich-thuoc-khau-phan-tp-combo',
    template: `
        <nz-select *ngIf="isEditMode" [formControl]="formControl" nzPlaceHolder="g"
                   #mySelect
                   (nzOpenChange)="nzOpenChange($event)"
                   [nzAllowClear]='nzAllowClear'
                   (nzFocus)='onFocus'
                   style="width:100%">
            <nz-option style="min-width: 300px" *ngFor="let option of optionList" [nzValue]="option.id"
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

export class KichThuocKhauPhanTpComboComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    @ViewChild('mySelect', {read: NzSelectComponent}) mySelect: NzSelectComponent;
    formControl: FormControl = new FormControl();
    public optionList: KichThuocKhauPhan_ThucPhamDto[] = [];
    public optionListSource: KichThuocKhauPhan_ThucPhamDto[] = [];
    _isDisabled = false;
    _thucPhamId: number;
    @Input() isEditMode = true;

    @Input() set thucPhamId(v: number) {
        this._thucPhamId = v;
        this.reloadDataSource(v);
    }

    get thucPhamId(): number {
        return this._thucPhamId;

    }

    @Input() allowAddItemMl = false;

    @Input() nzAllowClear = false;
    @Output() onItemSelected = new EventEmitter<KichThuocKhauPhan_ThucPhamDto>();
    _isFirstInitItemSelected = true;
    @Output() onOpenChange = new EventEmitter<boolean>();
    onWrireValue$: Subject<any> = new Subject<any>();
    onCallItemSelect$: Subject<any> = new Subject<any>();
    $destroy: Subject<boolean> = new Subject<boolean>();
    _itemSelected: KichThuocKhauPhan_ThucPhamDto = new KichThuocKhauPhan_ThucPhamDto;
    $dataSource: Subject<KichThuocKhauPhan_ThucPhamDto[]> = new Subject<KichThuocKhauPhan_ThucPhamDto[]>();
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
            if (this._isFirstInitItemSelected === false) {
                if (findItem) {
                    // findItem.id = findItem.id === -1 ? undefined : findItem.id;
                    this.onItemSelected.emit(findItem);
                } else {
                    this.onItemSelected.emit(new KichThuocKhauPhan_ThucPhamDto());
                }
            }
            this._isFirstInitItemSelected = false;
        }
    }

    getTextOption(option: KichThuocKhauPhan_ThucPhamDto): string {
        if (option.id >= 0) {
            // const ext = ' (' + option.khoiLuong + ' g)';
            return option.tenDonVi;
        } else {
            return option.tenDonVi;
        }
    }

    @Input()
    get disabled() {
        return this._isDisabled;
    }

    set disabled(v: boolean) {
        if (v) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
        this._isDisabled = v;
    }


    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private _dataService: ThucPhamServiceProxy,
    ) {
        super(injector);
        const wirite = this.onWrireValue$.pipe(debounceTime(100),
            distinctUntilChanged(),
            switchMap((value) => of(value)));
        combineLatest([this.$dataSource, wirite]).pipe(takeUntil(this.$destroy)).subscribe(([resultCbb, resultValue]) => {
            this.formControl.setValue(resultValue ? resultValue : -1); //new FormControl(resultValue ? resultValue : -1);
            this.onChange(resultValue === -1 ? undefined : resultValue);
            this.onCallItemSelect$.next(resultValue === -1 ? undefined : resultValue);
        });
    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }

    reloadDataSource(thucPhamId: number) {
        this._itemSelected.id = -1;
        this._itemSelected.thucPhamId = thucPhamId;
        this._itemSelected.khoiLuong = 1;
        this._itemSelected.tenDonVi = 'g';
        this._itemSelected.isDelete = false;
        if (thucPhamId) {
            this._comboboxService.getComboboxDataObs('kt-khau-phan-tp_' + thucPhamId,
                this._dataService.getAllKichThuocKhauPhan_ThucPham(thucPhamId), true)
                .pipe(debounceTime(300))
                .subscribe(resultCbb => {
                    const tempList = [];
                    const itemFirst = new KichThuocKhauPhan_ThucPhamDto();
                    itemFirst.id = -1;
                    itemFirst.thucPhamId = this.thucPhamId;
                    itemFirst.khoiLuong = 1;
                    itemFirst.tenDonVi = 'g';
                    itemFirst.isDelete = false;
                    tempList.push(itemFirst);
                    if (this.allowAddItemMl) {
                        const item2 = new KichThuocKhauPhan_ThucPhamDto();
                        item2.id = -99;
                        item2.thucPhamId = this.thucPhamId;
                        item2.khoiLuong = 1;
                        item2.tenDonVi = 'ml';
                        item2.isDelete = false;
                        tempList.push(item2);
                    }

                    this.optionList = tempList.concat(resultCbb);
                    this.optionListSource = this.optionList;

                    this.$dataSource.next(resultCbb);
                });
        } else {
            this.$dataSource.next([]);
        }

    }

    ngOnInit() {
        // this.reloadDataSource(this.thucPhamId);

        this.formControl.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe(result => {
            this.onChange(result === -1 ? undefined : result);
            this.onCallItemSelect$.next(result);
        });
        this.onCallItemSelect$.pipe(takeUntil(this.$destroy),
            distinctUntilChanged(),
            debounceTime(500), switchMap((item) => of(item)))
            .subscribe(result => {
                this.getItemSelect(result ? result : -1);
            });

    }

    nzOpenChange($event: boolean) {
        this.onOpenChange.emit($event);
        if ($event) {
            this._setWidth();
            // ^^^^^^^^
        }
    }

    _setWidth(): void {
        let maxLengh = 0;
        this.optionList.forEach(item => {
            if (maxLengh < item.tenDonVi.length) {
                maxLengh = item.tenDonVi.length;
            }
        });

        function getWidth(length) {
            console.log('getWidth', length);
            if (length < 10) {
                return 100;
            } else if (length < 20) {
                return 150;
            } else if (length < 30) {
                return 200;
            } else {
                return 250;
            }
        }

        // const width = maxLengh * 8;
        setTimeout(() => {
            this.mySelect.cdkConnectedOverlay.overlayRef.updateSize({
                width: getWidth(maxLengh),
                // minWidth: 150,
            });
        });
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: any): void {
        this.onWrireValue$.next(obj);
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
