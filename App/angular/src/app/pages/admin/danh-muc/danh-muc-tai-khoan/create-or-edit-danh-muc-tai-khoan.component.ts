import { Component, EventEmitter, Injector, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CheckValidSoTaiKhoanRequest,
    DanhMucTaiKhoanDto,
    DanhMucTaiKhoanPagingListRequest,
    DanhMucTaiKhoanServiceProxy,
    DanhMucTaiKhoanUpsertRequest,
} from '@shared/service-proxies/service-proxies';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
    selector: 'create-or-edit-danh-muc-tai-khoan',
    templateUrl: './create-or-edit-danh-muc-tai-khoan.component.html',
    styleUrls: ['./create-or-edit-danh-muc-tai-khoan.css'],
})
export class CreateOrEditDanhMucTaiKhoan extends AppComponentBase implements OnInit, OnDestroy {
    rfForm: FormGroup;
    accountGeneral: DanhMucTaiKhoanDto[];
    headerTitle: string = '';
    soTaiKhoanCha: string = '';
    @Input() dataItem: DanhMucTaiKhoanDto;
    @Input() totalItems: number;
    @Output() backListEvent = new EventEmitter();
    $destroy: Subject<boolean> = new Subject<boolean>();
    constructor(private injector: Injector, private fb: FormBuilder, private _danhMucTaiKhoanService: DanhMucTaiKhoanServiceProxy) {
        super(injector);
    }
    ngOnDestroy(): void {}

    ngOnInit(): void {
        this.rfForm = this.fb.group({
            soTaiKhoan: ['', [Validators.required, this.soTaiKhoanValidator()], [this.isSoTaiKhoanExistValidatorAsync()]],
            tenTaiKhoan: ['', [Validators.required]],
            parentId: [null],
            tinhChat: [null, [Validators.required]],
            dienGiai: [''],
            coHachToanNgoaiTe: [false],
            coDoiTuong: [false],
            doiTuong: null,
            coTaiKhoanNganHang: [false],
            coDoiTuongTHCP: false,
            doiTuongTHCP: null,
            coCongTrinh: false,
            congTrinh: null,
            coDonDatHang: false,
            donDatHang: null,
            coHopDongBan: false,
            hopDongBan: null,
            coHopDongMua: false,
            hopDongMua: null,
            coKhoanMucCP: false,
            khoanMucCP: null,
            coDonVi: false,
            donVi: null,
            coMaThongKe: false,
            maThongKe: null,
        });
        this.getAccountGeneral();
        this.rfForm.patchValue(this.dataItem);
    }

    onCheckBoxChange(val: boolean, target: string) {
        if (!target) {
            return;
        }

        if (!val) {
            this.rfForm.controls[target].setValue(null);
        }
    }

    getAccountGeneral(): void {
        const input = new DanhMucTaiKhoanPagingListRequest();
        input.maxResultCount = this.totalItems;
        input.skipCount = 0;
        this._danhMucTaiKhoanService.pagingListRequest(input).subscribe((res) => {
            if (this.dataItem?.id > 0) {
                this.headerTitle = 'Sửa tài khoản';
            } else {
                this.headerTitle = 'Thêm tài khoản mới';
            }

            this.accountGeneral = res.items?.filter((item) => item.id !== this.dataItem?.id);
        });
    }

    isSoTaiKhoanExistValidatorAsync(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            var input = new CheckValidSoTaiKhoanRequest();
            input.soTaiKhoan = control.value;
            return this._danhMucTaiKhoanService
                .isSoTaiKhoanExist(input)
                .pipe(debounceTime(500))
                .pipe(
                    map((res) => {
                        if (res) {
                            return { soTaikhoanIsExist: true };
                        }

                        return null;
                    }),
                );
        };
    }

    soTaiKhoanValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }

            if (control.value.length < 3) {
                return { passwordLength: true };
            }
            if (this.soTaiKhoanCha) {
                if (this.soTaiKhoanCha.startsWith(control.value)) {
                    return { khongTrungTaiKhoanCha: true };
                }
            }

            return null;
        };
    }

    addParentAccount(account: DanhMucTaiKhoanDto) {
        this.rfForm.controls['parentId'].setValue(account.id);
        this.soTaiKhoanCha = account.soTaiKhoan;
    }

    close() {
        this.backListEvent.emit();
    }

    submit(isAddAndClose = false) {
        if (this.rfForm.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');

            for (const i in this.rfForm.controls) {
                this.rfForm.controls[i].markAsDirty();
                this.rfForm.controls[i].updateValueAndValidity();
            }
            console.log(this.rfForm);

            return;
        }

        let input = new DanhMucTaiKhoanUpsertRequest();
        Object.assign(input, this.rfForm.value);
        this._danhMucTaiKhoanService.insertOrUpdate(input).subscribe((res) => {
            if (!input.id) {
                this.notify.success('Thêm mới tài khoản thành công');
            } else {
                this.notify.success('Sửa tài khoản thành công');
            }

            if (isAddAndClose) {
                this.close();
            } else {
                this.rfForm.markAsPristine();
                this.rfForm.updateValueAndValidity();
                this.rfForm.reset();
            }
        });
    }
}
