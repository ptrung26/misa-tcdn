import {Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Provider} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Subject} from '@node_modules/rxjs';
import {debounceTime, takeUntil} from '@node_modules/rxjs/internal/operators';

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => KichThuocKhauPhanItemComponent),
    multi: true
};

export interface IKickThuocKhauPhanItem {
    id: number | undefined;
    // soLuong: number | undefined;
    tenDonVi: string | undefined;
    khoiLuong: number | undefined;
    imgBinaryObjectId: string | undefined;
    isKTKPMacDinh: boolean;
    // khoiLuongChin: number | undefined;
    // tyLeThaiBo: number | undefined;
    isDelete: boolean;
}

@Component({
    selector: 'kich-thuoc-khau-phan-item',
    templateUrl: './kich-thuoc-khau-phan-item.component.html',
    styleUrls: ['./kich-thuoc-khau-phan-item.component.css'],
    providers: [VALUE_ACCESSOR]
})
export class KichThuocKhauPhanItemComponent implements OnInit, OnDestroy, ControlValueAccessor {
    rfDataModal: FormGroup;
    _isDisabled = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    @Output() onDelete = new EventEmitter();
    @Input() alowDelete = true;
    @Input() titleField2 = 'Tổng khối lượng cho 1 phần ăn (g)';
    @Output() onSetDonViMacDinh = new EventEmitter<boolean>();

    private onChange: Function = (v: IKickThuocKhauPhanItem) => {
    };
    private onTouched: Function = () => {
    };

    @Input()
    get value() {
        return this.rfDataModal.value;
    }

    set value(v: IKickThuocKhauPhanItem) {
        console.log('pathValue', v);
        this.rfDataModal.patchValue(v);
    }

    @Input()
    get isDisabled() {
        return this._isDisabled;
    }

    set isDisabled(v: boolean) {
        console.log('setDis');
        if (v) {
            this.rfDataModal.disable();
        } else {
            this.rfDataModal.enable();
        }
        this._isDisabled = v;
    }

    constructor(private fb: FormBuilder) {
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            id: undefined,
            // soLuong: [{'': undefined, disabled: this.isDisabled}],
            tenDonVi: [{value: '', disabled: this.isDisabled}],
            khoiLuong: [{value: undefined, disabled: this.isDisabled}],
            isKTKPMacDinh: [{value: undefined, disabled: this.isDisabled}],
            // khoiLuongChin: [{value: undefined, disabled: this.isDisabled}],
            // tyLeThaiBo: [{value: undefined, disabled: this.isDisabled}],
            isDelete: [false]
        });
        console.log('init');
        this.rfDataModal.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(100)).subscribe(result => {
            console.log('changeData');
            // this.onChange(undefined);
            this.onChange(result);
        });
        this.rfDataModal.get('isKTKPMacDinh').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.onSetDonViMacDinh.emit(result);
        });
    }

    // checkFormIsInvalid() {
    //     if (this.rfDataModal.invalid) {
    //         // tslint:disable-next-line:forin
    //         for (const i in this.rfDataModal.controls) {
    //             this.rfDataModal.controls[i].markAsDirty();
    //             this.rfDataModal.controls[i].updateValueAndValidity();
    //         }
    //     }
    //     return this.rfDataModal.invalid;
    // }

    onDeleteClick() {
        const curValue = this.rfDataModal.get('isDelete').value;
        this.isDisabled = !curValue;
        this.rfDataModal.get('isDelete').setValue(!curValue);

        if (this.isDisabled) {
            this.onDelete.emit();
            // this.rfDataModal.enable();
        }
    }


    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: IKickThuocKhauPhanItem): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        console.log('setDisabledState');
        this.isDisabled = isDisabled;
    }


}
