import {Component, Injector, Input, OnInit} from '@angular/core';
import {ModalComponentBase} from '@shared/common/modal-component-base';
import {FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl} from '@angular/forms';
import {
    DanhMucNhomThucPhamServiceProxy,
    NhomThucPhamDto,
    CheckValidImportExcelNhomThucPhamRequest, CheckValidImportExcelNhomThucPhamDto
} from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'app-up-load-nhom-thuc-pham-modal',
    templateUrl: './up-load-nhom-thuc-pham-modal.component.html',
    styleUrls: ['./up-load-nhom-thuc-pham-modal.component.css']
})
export class UpLoadNhomThucPhamModalComponent extends ModalComponentBase implements OnInit {

    @Input() dataInput: any[] = [];
    rfDataModal: FormGroup;
    header: string[] = [];

    constructor(injector: Injector,
                private dataService: DanhMucNhomThucPhamServiceProxy,
                private  fb: FormBuilder) {
        super(injector);
    }

    ngOnInit() {
        this.rfDataModal = this.fb.group({
            listData: this.fb.array([], (abs: AbstractControl) => {
                const v: any[] = abs.value;
                const itemFind = v.find(x => x.isValid === false);
                if (itemFind) {
                    return {
                        notValidData: true
                    };
                }
            })
        });
        this.header = this.dataInput[0];
        this.initFormArray();
    }

    get datas(): FormArray {
        return this.rfDataModal.get('listData') as FormArray;
    }

    initFormArray() {
        const controls = this.datas;
        this.dataInput.forEach((item, index) => {
            if (index > 0) {
                controls.push(
                    this.fb.group({
                        tenVi: [item[0], [Validators.required]],
                        tenEn: [item[1], [Validators.required]],
                        strLoaiNhomThucPham: [item[2], [Validators.required]],
                        moTa: [item[3], [Validators.required]],
                        loaiNhomThucPham: [''],
                        isValid: [true],
                        listError: [[]]
                    })
                );
            }
        });
        this.checkValidData();
    }

    checkValidData() {
        const data: any[] = this.datas.value;
        const input = new CheckValidImportExcelNhomThucPhamRequest();
        input.input = data.map(item => {
            const res = new CheckValidImportExcelNhomThucPhamDto();
            res.tenVi = item.tenVi;
            res.tenEn = item.tenEn;
            res.loaiNhomThucPham = item.loaiNhomThucPham;
            res.strLoaiNhomThucPham = item.strLoaiNhomThucPham;
            res.stt = item.stt;
            return res;
        });
        this.dataService.checkValidImportExcelNhomThucPham(input).subscribe(result => {
            this.datas.controls.forEach((contr, index) => {
                const itemFind = result[index];
                if (itemFind) {
                    contr.get('isValid').setValue(itemFind.isValid);
                    contr.get('listError').setValue(itemFind.listError);
                    contr.get('loaiNhomThucPham').setValue(itemFind.loaiNhomThucPham);
                }
            });
        });
    }

    // chonMonAnFromTable(contr: FormControl) {
    //     const modal = this.modalService.create({
    //         nzTitle: 'Lựa chọn món ăn ',
    //         nzContent: ListMonHienCoModalComponent,
    //         nzWidth: '60%',
    //         nzComponentParams: {
    //             callbackFun: this.callBackFromMonDaChonTable
    //         },
    //         nzFooter: null
    //     });
    //
    // }
    //
    // callBackFromMonDaChonTable = ($event: MonAnExtend) => {
    //     this._monDaChonService.addItem($event);
    // };


    save() {
        if (this.rfDataModal.invalid) {
            abp.notify.error('Vui lòng xem lại thông tin đã nhập!');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
            // tslint:disable-next-line:forin
            for (const i in this.datas.controls) {
                const fGr: any = this.datas.controls[i];
                // tslint:disable-next-line:forin
                for (const j in fGr.controls) {
                    fGr.controls[j].markAsDirty();
                    fGr.controls[j].updateValueAndValidity();
                }
            }
        } else {
            this.dataService.uploadExcelNhomThucPham(this.rfDataModal.value).subscribe(() => {
                abp.notify.success('Xử lý thành công!');
                this.close();
            });
        }
    }

    onSerachClick(contr: AbstractControl) {
        // const modal = this.modalService.create({
        //     nzTitle: 'Tìm kiếm thực phẩm',
        //     nzContent: ChonThucPhamFromTableComponent,
        //     nzWidth: '60%',
        //     nzComponentParams: {
        //         callbackFun: (item: ThucPhamDto) => {
        //             contr.get('maThucPhamKetNoi').setValue(item.maBTP2007);
        //         }
        //     },
        //     nzFooter: null
        // });
    }
}
