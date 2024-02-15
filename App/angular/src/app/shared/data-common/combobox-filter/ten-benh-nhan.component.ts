import {
    Component,
    forwardRef,
    OnInit,
    Provider,
    Input,
    OnChanges,
    SimpleChanges,
    TemplateRef,
    OnDestroy
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {
    ComboboxItemDto,
    ThanhVienPagingOutputDto,
    QuanLyThanhVienServiceProxy,
    GetAllThanhVienPagingRequest
} from '@shared/service-proxies/service-proxies';
import {DataCommonService} from '@app/shared/data-common/data-common.service';
import {BehaviorSubject, Observable, Subject} from '@node_modules/rxjs';
import {debounceTime, finalize, map, startWith, switchMap, takeUntil, tap} from '@node_modules/rxjs/internal/operators';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TenBenhNhanComboComponent),
    multi: true
};

@Component({
    selector: 'ten-benh-nhan-combo',
    template: `
        <nz-select [(ngModel)]="_value" nzAllowClear
                   nzPlaceHolder="Chọn tên bênh nhân..."
                   [nzLoading]="isLoading"
                   [nzMode]="nzMode"
                   (ngModelChange)='onChangeValue($event)'
                   [nzDisabled]='_isDisabled' (nzFocus)='onFocus'
                   nzShowSearch
                   nzServerSearch
                   [nzNotFoundContent]="refNotFound"
                   (nzOnSearch)="search($event)"
                   style="width:100%">
            <nz-option *ngFor="let option of optionList" [nzValue]="option.value"
                       [nzLabel]="option.displayText"></nz-option>
        </nz-select>
    `,
    providers: [VALUE_ACCESSOR]

})

export class TenBenhNhanComboComponent implements OnInit, OnDestroy, ControlValueAccessor {
    _value = undefined;
    _isDisabled = false;
    _filter: GetAllThanhVienPagingRequest = new GetAllThanhVienPagingRequest();
    filter$: BehaviorSubject<GetAllThanhVienPagingRequest>;
    destroy$: Subject<boolean> = new Subject<boolean>();
    optionList: ComboboxItemDto[] = [];
    isLoading = false;
    @Input() nzMode: 'default' | 'multiple' | 'tags' = 'default';
    @Input() closeOnSelect = false;
    @Input() refNotFound: TemplateRef<any> | string = 'Không tìm thấy thực phẩm...';

    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };


    @Input()
    get value() {
        return this._value;
    }

    set value(v: any) {
        if (typeof (v) === 'number') {
            this._value = v.toString();
        } else {
            this._value = v;
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
        private _comboboxService: DataCommonService,
        private _benhNhanService: QuanLyThanhVienServiceProxy,
    ) {
        this._filter.skipCount = 0;
        this._filter.maxResultCount = 50;
        this.filter$ = new BehaviorSubject<GetAllThanhVienPagingRequest>(this._filter);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }


    ngOnInit() {
        this.getDataSource();
        this.filter$.pipe(takeUntil(this.destroy$),
            debounceTime(500),
            tap(() => this.isLoading = true),
            switchMap((filter) => this._benhNhanService.getAllThanhVienPaging(filter)),
            map(data => data.items.map(item => {
                const res = new ComboboxItemDto();
                res.value = item.id.toString();
                res.displayText =  item.ten.toUpperCase();
                return res;
            })),
        ).subscribe(result => {
            this.optionList = result;
            this.isLoading = false;
        });
    }

    getDataSource(listOfNhomIds?: number[]) {
        this.filter$.next(this._filter);
    }

    search(value: string): void {
        this._filter.filter = value;
        this.filter$.next(this._filter);
    }

    //#region Control Value Acc
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
        this.disabled = isDisabled;
    }

    //#endregion

}
