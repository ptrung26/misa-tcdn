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
    finalize, map,
    mergeMap,
    switchMap,
    takeUntil
} from '@node_modules/rxjs/operators';
import {BehaviorSubject, combineLatest, concat, from, of, Subject} from '@node_modules/rxjs';
import * as _ from 'lodash';

export interface IMonAnGroupCombo {
    strNhomMonAn: string;
    monAns: IMonAnCombo[];
}

export interface IMonAnCombo {
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
    cachCheBien: string;
}

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MonAnComboComponent),
    multi: true
};

@Component({
    selector: 'mon-an-combo',
    template: `
        <nz-select [formControl]="formControl"
                   *ngIf="editMode"
                   [nzPlaceHolder]="placeHolder"
                   nzShowSearch
                   nzServerSearch
                   (nzOnSearch)="search($event)"
                   [nzAllowClear]='nzAllowClear'
                   (nzFocus)='onFocus($event)'
                   [compareWith]="compareFn"
                   style="width:100%"
                   [nzDropdownRender]="renderTemplate">
            <nz-option-group [nzLabel]="optionGr.strNhomMonAn" *ngFor="let optionGr of optionList">
                <ng-container *ngFor="let option of optionGr.monAns">
                    <nz-option
                        nzCustomContent
                        [nzValue]="option"
                        [nzLabel]="option.tenVi">
                        <div style="display: flex;justify-content: space-between;">
                            <div class="padding-right-5">
                                <span>{{option.tenVi}}</span>
                            </div>
                            <div style="display: flex" class="font-weight-bold">
                                <span style="color:red">{{option.nangLuong | oraNumber:'.0-0'}}</span>
                                <span style="color:blue" class="margin-left-5">Kcal</span>
                            </div>
                        </div>
                    </nz-option>
                </ng-container>
            </nz-option-group>
            <ng-template #renderTemplate>
                <nz-spin *ngIf="isLoading"></nz-spin>
            </ng-template>
        </nz-select>
        <div *ngIf="!editMode">
            {{_itemSelected?.tenVi}}
        </div>
        <!--        <pre>-->
        <!--            formControl: {{formControl.value|json}}-->
        <!--        </pre>-->
        <!--        <pre>-->
        <!--            _itemSelected: {{_itemSelected|json}}-->
        <!--        </pre>-->
    `,
    styles: [`

    `],
    providers: [VALUE_ACCESSOR]

})

export class MonAnComboComponent extends AppComponentBase implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input() resetItemAfterSelect = false;
    @Input() placeHolder = 'Nhập tên món ăn hoặc chọn từ danh sách...';

    @Input()
    get value() {
        return this.formControl.value;
    }

    set value(v: any) {
        this.formControl.setValue(v);
    }


    get disabled() {
        return this.formControl.disabled;
    }

    @Input() set disabled(v: boolean) {
        if (v) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }

    @Input() set listNhomMonAnId(v: number[]) {
        const curFilter = this.filterSearch$.value;
        if (v && !_.isEqual(curFilter.listNhomMonAnId, v)) {
            curFilter.listNhomMonAnId = v;
            this.filterSearch$.next(curFilter);
        }
    }

    @Input() editMode = true;


    constructor(
        injector: Injector,
        private _comboboxService: DataCommonService,
        private _dataService: MonAnServiceProxy,
    ) {
        super(injector);
        const filter: MonAnGetAllServerPagingRequest = new MonAnGetAllServerPagingRequest();
        filter.isActive = true;
        filter.maxResultCount = 30;
        filter.skipCount = 0;
        this.filterSearch$ = new BehaviorSubject<MonAnGetAllServerPagingRequest>(filter);

    }

    formControl: FormControl = new FormControl();
    public optionList: IMonAnGroupCombo[] = [];
    public optionListSource: IMonAnGroupCombo[] = [];
    optionListFlat: IMonAnCombo[] = [];
    @Input() nzAllowClear = false;
    @Output() onItemSelected = new EventEmitter<IMonAnCombo>();
    _isFirstInitItemSelected = true;
    @Output() onOpenChange = new EventEmitter<boolean>();
    onWrireValue$: Subject<number> = new Subject<number>();
    // onCallItemSelect$: Subject<any> = new Subject<any>();
    filterSearch$: BehaviorSubject<MonAnGetAllServerPagingRequest>;
    filterText$: Subject<string> = new Subject<string>();
    $destroy: Subject<boolean> = new Subject<boolean>();
    _itemSelected: IMonAnCombo;
    isLoading = false;

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    // getItemSelect(monAnId: any) {
    //     if (this.optionListFlat && this.optionListFlat.length > 0) {
    //         // tslint:disable-next-line:triple-equals
    //         const findItem = this.optionListFlat.find(x => x.monAnId == monAnId);
    //         if (this.resetItemAfterSelect) {
    //             this.formControl.reset();
    //             this._itemSelected = undefined;
    //         } else {
    //             this._itemSelected = findItem;
    //         }
    //         if (this._isFirstInitItemSelected === false) {
    //             if (findItem) {
    //                 // findItem.id = findItem.id === -1 ? undefined : findItem.id;
    //                 this.onItemSelected.emit(findItem);
    //             } else {
    //                 this.onItemSelected.emit(undefined);
    //             }
    //
    //         }
    //         this._isFirstInitItemSelected = false;
    //     }
    // }

    compareFn = (o1: IMonAnCombo, o2: IMonAnCombo) => (o1 && o2 ? o1.monAnId === o2.monAnId : o1 === o2);

    ngAfterViewInit(): void {

    }


    ngOnInit() {
        this.optionListFlat = [];
        this.isLoading = true;
        this.filterText$.pipe(takeUntil(this.$destroy), distinctUntilChanged(), debounceTime(100))
            .subscribe(result => {
                const curFilter = this.filterSearch$.value;
                curFilter.filter = result;
                this.filterSearch$.next(curFilter);
            });
        combineLatest([
            this.filterSearch$.pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                switchMap((filter) => {
                    return this._dataService.getAllServerPaging(filter).pipe(map((item) => item.items));
                })), this.onWrireValue$.pipe(
                debounceTime(100),
                switchMap((value) => of(value))
            )]).pipe(
            switchMap(([resultCbb, resultValue]) => {
                const findIndex = resultCbb.findIndex(x => x.id === resultValue);
                if (findIndex > -1 || !resultValue) {
                    return of({
                        cbb: resultCbb,
                        resultValue: resultValue
                    });
                } else {
                    return this._dataService.getMonAnBoSungCbb(resultValue)
                        .pipe(map((item) => {
                            resultCbb.push(item);
                            return {
                                cbb: resultCbb,
                                resultValue: resultValue
                            };
                        }));
                }
                // return of(null);
            }),
            takeUntil(this.$destroy),
        )
            .subscribe((result) => {
                this.loadDataSource(result.cbb);
                this.isLoading = false;
                this._itemSelected = this.optionListFlat.find(x => x.monAnId === result.resultValue);
                this.formControl.setValue(this._itemSelected);
                // this.onChange(result.resultValue);
            });
        this.formControl.valueChanges.pipe(takeUntil(this.$destroy), distinctUntilChanged((pre, cur) => {
            const prez = pre ? pre : {};
            const curz = cur ? cur : {};
            return prez.monAnId === curz.monAnId;
            // (pre, cur) => (pre && cur) ? (pre.monAnId === cur.monAnId) : true
        }), debounceTime(100)).subscribe((result: IMonAnCombo) => {
            if (this.resetItemAfterSelect) {
                if (result) {
                    this.onChange(result);
                    this._itemSelected = result;
                    this.onItemSelected.emit(result);

                    this.formControl.reset();
                    this._itemSelected = undefined;
                }
            } else {
                this.onChange(result ? result.monAnId : undefined);
                this._itemSelected = result;
                this.onItemSelected.emit(result);
            }
            // this.onCallItemSelect$.next(result);
        });
        // this.onCallItemSelect$.pipe(takeUntil(this.$destroy), debounceTime(500), switchMap((item) => of(item)))
        //     .subscribe(result => {
        //         this.getItemSelect(result);
        //     });
    }

    private loadDataSource(data: MonAnPagingOutputDto[]) {
        this.optionListFlat = data.map(item => {
            const res: IMonAnCombo = {
                monAnId: item.id,
                nangLuong: item.nangLuongKcal,
                arrNhomMonAn: item.arrNhomMonAn,
                strNhomMonAn: item.arrNhomMonAn.length === 0 ? 'Chưa phân nhóm' : item.arrNhomMonAn.join(', '),
                tenVi: item.tenVi,
                tenEn: item.tenEn,
                moTa: item.moTa,
                imgBinaryObjectId: item.imgBinaryObjectId,
                khoiLuong: item.khoiLuong,
                khoiLuongAuto: item.khoiLuongAuto,
                cachCheBien: item.cachCheBien
            };
            return res;
        });
        this.optionList = _.chain(this.optionListFlat).groupBy('strNhomMonAn').map((value, key) => {
            const res: IMonAnGroupCombo = {
                strNhomMonAn: key,
                monAns: _.sortBy(value, 'nangLuong')
            };
            return res;
        }).value();
        this.optionListSource = this.optionList;
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
    }


    search($event: string) {
        this.filterText$.next($event);

    }

    nzOpenChange($event: boolean) {
        this.onOpenChange.emit($event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: number): void {
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
