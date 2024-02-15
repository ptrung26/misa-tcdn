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
    Provider
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    KichThuocKhauPhan_MonAnDto,
    KichThuocKhauPhan_ThucPhamDto,
    MonAnGetAllServerPagingRequest, MonAnPagingOutputDto,
    MonAnServiceProxy,
    PagedResultDtoOfMonAnPagingOutputDto,
    ThucPhamServiceProxy
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {
    debounceTime,
    distinctUntilChanged,
    finalize,
    mergeMap,
    switchMap,
    takeUntil
} from '@node_modules/rxjs/operators';
import {combineLatest, from, of, Subject} from '@node_modules/rxjs';
import * as _ from 'lodash';

export interface IMonAnTuNauGroupCombo {
    strNhomMonAn: string;
    monAns: IMonAnTuNauCombo[];
}

export interface IMonAnTuNauCombo {
    strNhomMonAn: string;
    monAnId: number;
    tenVi: string;
    tenEn: string;
    imgBinaryObjectId: string;
    arrNhomMonAn: string[] | undefined;
    moTa: string;
    nangLuong: number | undefined;
    khoiLuong: number | undefined;
    khoiLuongAuto: number | undefined;
}

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonAnTuNauComboComponent),
    multi: true
};

@Component({
    selector: 'mon-an-tu-nau-combo',
    template: `
        <nz-select [formControl]="formControl"
                   nzPlaceHolder="Chọn..."
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)"
                   [nzAllowClear]='nzAllowClear'
                   (nzFocus)='onFocus($event)'
                   style="width:100%"
                   [nzDropdownRender]="renderTemplate">
            <nz-option-group [nzLabel]="optionGr.strNhomMonAn" *ngFor="let optionGr of optionList">
                <ng-container *ngFor="let option of optionGr.monAns">
                    <nz-option
                        nzCustomContent
                        [nzValue]="option.monAnId"
                        [nzLabel]="option.tenVi">
                        <nz-row nzJustify="space-between">
                            <nz-col>
                                (MÃ:{{option.monAnId}})
                                <span>{{option.tenVi}}</span>
                            </nz-col>
                        </nz-row>
                    </nz-option>
                </ng-container>
            </nz-option-group>
            <ng-template #renderTemplate>
                <nz-spin *ngIf="isLoading"></nz-spin>
                <div *ngIf="isSearchNoItems">
                    <nz-divider style="margin-top:20px;margin-bottom:0"></nz-divider>
                    <div class="container" style="text-align:center;background:#389e0d">
                        <button nz-button nzType="default" class="add-item" (click)="addMonAnTuNauItem()"
                                style="border:0;background:#389e0d;color:#fff"
                        >
                            <i nz-icon nzType="plus"></i> Thêm món ăn mới
                        </button>
                    </div>
                </div>
            </ng-template>
        </nz-select>
    `,
    styles: [`

    `],
    providers: [VALUE_ACCESSOR]

})

export class MonAnTuNauComboComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input() resetItemAfterSelect = false;

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

    @Input()
    get disabled() {
        return this.formControl.disabled;
    }

    set disabled(v: boolean) {
        if (v) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }


    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private _dataService: MonAnServiceProxy,
    ) {
        super(injector);
        this.filter.isActive = true;
        this.filter.maxResultCount = 30;
        this.filter.skipCount = 0;

    }

    formControl: FormControl = new FormControl();
    public optionList: IMonAnTuNauGroupCombo[] = [];
    public optionListSource: IMonAnTuNauGroupCombo[] = [];
    optionListFlat: IMonAnTuNauCombo[] = [];
    @Input() nzAllowClear = false;
    @Output() onItemSelected = new EventEmitter<IMonAnTuNauCombo>();
    _isFirstInitItemSelected = true;
    @Output() onOpenChange = new EventEmitter<boolean>();
    onWrireValue$: Subject<any> = new Subject<any>();
    onCallItemSelect$: Subject<any> = new Subject<any>();
    filterSearch$: Subject<string> = new Subject<string>();
    $destroy: Subject<boolean> = new Subject<boolean>();
    _itemSelected: IMonAnTuNauCombo;
    // _maxResultCount = 20;
    // _skipCount = 0;
    isLoading = false;
    filter: MonAnGetAllServerPagingRequest = new MonAnGetAllServerPagingRequest();

    isSearchNoItems = false;
    @Input() isCalledFromMonAnTuNau = false;
    @Output() strFilterEmit = new EventEmitter<string>();
    @Output() monAnIdEmit = new EventEmitter<number>();

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    getItemSelect(monAnId: any) {
        if (this.optionListFlat && this.optionListFlat.length > 0) {
            // tslint:disable-next-line:triple-equals
            const findItem = this.optionListFlat.find(x => x.monAnId == monAnId);
            if (this.resetItemAfterSelect) {
                this.formControl.reset();
                this._itemSelected = undefined;
            } else {
                this._itemSelected = findItem;
            }
            if (this._isFirstInitItemSelected === false) {
                if (findItem) {
                    // findItem.id = findItem.id === -1 ? undefined : findItem.id;
                    this.onItemSelected.emit(findItem);
                } else {
                    this.onItemSelected.emit(undefined);
                }

            }
            this._isFirstInitItemSelected = false;
        }
    }

    ngAfterViewInit(): void {

    }


    ngOnInit() {
        this.optionListFlat = [];
        const wirite = this.onWrireValue$.pipe(distinctUntilChanged(), debounceTime(100),
            switchMap((value) => of(value)));
        const dataCbb = this._dataService.getAllServerPaging(this.filter).pipe(debounceTime(100));
        this.isLoading = true;
        combineLatest([dataCbb, wirite]).pipe(takeUntil(this.$destroy))
            .subscribe(([resultCbb, resultValue]) => {
                this.loadDataSource(resultCbb.items);
                this.isLoading = false;
                this.formControl.setValue(resultValue);
                this.onChange(resultValue);
            });
        this.formControl.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100)).subscribe(result => {
            this.onChange(result);
            this.onCallItemSelect$.next(result);
        });
        this.onCallItemSelect$.pipe(takeUntil(this.$destroy), debounceTime(500), switchMap((item) => of(item)))
            .subscribe(result => {
                this.getItemSelect(result);
            });

        this.filterSearch$.pipe(takeUntil(this.$destroy),
            debounceTime(500),
            switchMap((filter) => {
                this.filter.skipCount = 0;
                this.filter.filter = filter;
                this.isLoading = true;
                return this._dataService.getAllServerPaging(this.filter).pipe(debounceTime(100));
            })).subscribe(result => {
                this.isSearchNoItems = result.items.length < 1 ? true : false;
                this.loadDataSource(result.items);
                this.isLoading = false;
            });
    }

    addMonAnTuNauItem() {
        if (this.filter.filter != null && this.filter.filter != "") {
            this.strFilterEmit.emit(this.filter.filter);
        }
    }

    private loadDataSource(data: MonAnPagingOutputDto[]) {
        this.optionListFlat = data.map(item => {
            const res: IMonAnTuNauCombo = {
                monAnId: item.id,
                nangLuong: item.nangLuongKcal,
                arrNhomMonAn: item.arrNhomMonAn,
                strNhomMonAn: item.arrNhomMonAn.length === 0 ? 'Chưa phân nhóm' : item.arrNhomMonAn.join(', '),
                tenVi: item.tenVi,
                tenEn: item.tenEn,
                moTa: item.moTa,
                imgBinaryObjectId: item.imgBinaryObjectId,
                khoiLuong: item.khoiLuong,
                khoiLuongAuto: item.khoiLuongAuto
            };
            return res;
        });
        this.optionList = _.chain(this.optionListFlat).groupBy('strNhomMonAn').map((value, key) => {
            const res: IMonAnTuNauGroupCombo = {
                strNhomMonAn: key,
                monAns: value
            };
            return res;
        }).value();
        this.optionListSource = this.optionList;
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }


    loadMore() {
        this.filter.skipCount += this.filter.maxResultCount;
        this.loadData();
    }

    loadData() {
        this.isLoading = true;
        this._dataService.getAllServerPaging(this.filter).pipe(debounceTime(100), finalize(() => this.isLoading = false))
            .subscribe(result => {
                this.optionListFlat = this.optionListFlat.concat(result.items.map(item => {
                    const res: IMonAnTuNauCombo = {
                        monAnId: item.id,
                        nangLuong: item.nangLuongKcal,
                        arrNhomMonAn: item.arrNhomMonAn,
                        strNhomMonAn: item.arrNhomMonAn.length === 0 ? 'Chưa phân nhóm' : item.arrNhomMonAn.join(', '),
                        tenVi: item.tenVi,
                        tenEn: item.tenEn,
                        moTa: item.moTa,
                        imgBinaryObjectId: item.imgBinaryObjectId,
                        khoiLuong: item.khoiLuong,
                        khoiLuongAuto: item.khoiLuongAuto
                    };
                    return res;
                }));
                this.optionList = _.chain(this.optionListFlat).groupBy('strNhomMonAn').map((value, key) => {
                    const res: IMonAnTuNauGroupCombo = {
                        strNhomMonAn: key,
                        monAns: value
                    };
                    return res;
                }).value();
                this.optionListSource = this.optionList;
            });
    }

    search($event: string) {
        this.filterSearch$.next($event);
    }

    nzOpenChange($event: boolean) {
        this.onOpenChange.emit($event);
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
