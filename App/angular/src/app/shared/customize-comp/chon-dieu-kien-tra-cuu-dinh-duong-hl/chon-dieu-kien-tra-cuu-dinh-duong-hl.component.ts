import {
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    OnInit,
    Output,
    Provider,
    ViewEncapsulation,
} from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    DieuKienModalComponent,
} from '@app/shared/customize-comp/chon-dieu-kien-tra-cuu-dinh-duong-hl/dieu-kien-modal.component';
import {
    DieuKienTraCuuDinhDuongDto,
    DieuKienTuyChinhRequest,
    TraCuuDinhDuongServiceProxy,
    TraCuuDinhDuongTuyChinhRequest,
} from '@shared/service-proxies/service-proxies';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChonDieuKienMauModalComponent } from '@app/shared/customize-comp/chon-dieu-kien-tra-cuu-dinh-duong-hl/chon-dieu-kien-mau-modal/chon-dieu-kien-mau-modal.component';
import { NzModalService } from '@node_modules/ng-zorro-antd/modal';
import * as _ from 'lodash';
// declare var $: any;

// export interface ITraCuuTuyChinhDto {
//     loaiSoSanh: string;
//     children: IDieuKienDinhDuongDto[];
// }

const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChonDieuKienTraCuuDinhDuongHlComponent),
    multi: true,
};

@Component({
    templateUrl: './chon-dieu-kien-tra-cuu-dinh-duong-hl.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
    selector: 'chon-dieu-kien-tra-cuu-dinh-duong',
    styleUrls: ['chon-dieu-kien-tra-cuu-dinh-duong-hl.component.scss'],
    providers: [VALUE_ACCESSOR],
})

export class ChonDieuKienTraCuuDinhDuongHlComponent extends AppComponentBase implements OnInit, ControlValueAccessor {
    listOfDieuKien: DieuKienTuyChinhRequest[] = [];
    // level1Idx = -1;
    // level2Idx = -1;
    // loaiSoSanh = '';
    // itemOfDinhDuongEdit: IDieuKienDinhDuongDto;
    @Input() showChonDieuKienMau = true;

    @Input()
    get value() {
        return this.listOfDieuKien;
    }

    set value(v: DieuKienTuyChinhRequest[]) {
        this.listOfDieuKien = v ? v : [];
    }

    private onChange: Function = (v: DieuKienTuyChinhRequest[]) => {
    };
    private onTouched: Function = () => {
    };


    constructor(
        injector: Injector,
        private _appService: TraCuuDinhDuongServiceProxy,
        private _modalService: NzModalService,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // this.getDieuKienTraCuuDaLuu();
    }

    //#region base
    onChangeValue(event: any): void {
        this.onChange(event);
    }

    onFocus(event: any): void {
        this.onTouched();
    }


    writeValue(obj: DieuKienTuyChinhRequest[]): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }


    //#endregion

    changeLoaiSoSanh(item: DieuKienTraCuuDinhDuongDto, loaiSS: string) {
        item.loaiSoSanh = loaiSS;
        //$('.ant-popover').hide();
        this.onChange(this.listOfDieuKien);
    }

    changeLoaiSoSanhItemRoot(item: DieuKienTuyChinhRequest, loaiSS: string) {
        item.loaiSoSanh = loaiSS;
        //$('.ant-popover').hide();
        this.onChange(this.listOfDieuKien);
    }

    //#region itemChild
    showEditChidModal(idxRoot: number, idxChild: number) {
        //$('.ant-popover').hide();
        const modal = this._modalService.create({
            nzTitle: 'Sửa điều kiện tra cứu',
            nzContent: DieuKienModalComponent,
            nzComponentParams: {
                dataItem: this.listOfDieuKien[idxRoot].children[idxChild],
            },
            nzFooter: null,
        });

        modal.afterClose.subscribe((result: DieuKienTraCuuDinhDuongDto) => {
            if (result) {
                this.listOfDieuKien[idxRoot].children[idxChild] = result;
                this.onChange(this.listOfDieuKien);
            }
        });
    }

    xoaItemLevel2(idxRoot: number, idxChild: number) {
        if (this.listOfDieuKien[idxRoot].children.length === 1) {
            // nếu xóa phần tử cuối cùng
            this.listOfDieuKien.splice(idxRoot, 1);
        } else {
            this.listOfDieuKien[idxRoot].children.splice(idxChild, 1);
            if (idxChild === 0) {
                this.listOfDieuKien[idxRoot].children[0].loaiSoSanh = '';
            }
        }
        this.onChange(this.listOfDieuKien);
    }

    showAddChildModal(children: DieuKienTraCuuDinhDuongDto[], loaiSS: string) {
        //$('.ant-popover').hide();
        const modal = this._modalService.create({
            nzTitle: 'Thêm điều kiện tra cứu',
            nzContent: DieuKienModalComponent,
            nzComponentParams: {
                dataItem: {
                    dinhDuongId: undefined,
                    loaiSoSanh: loaiSS,
                    min: undefined,
                    max: undefined,
                    display: '',
                } as DieuKienTraCuuDinhDuongDto,
            },
            nzFooter: null,
        });

        modal.afterClose.subscribe((result: DieuKienTraCuuDinhDuongDto) => {
            if (result) {
                children.push(result);
                this.onChange(this.listOfDieuKien);
            }
        });
    }

    //#endregion end Child
    showAddRootItemModal(loaiSS: string) {
        //$('.ant-popover').hide();
        const modal = this._modalService.create({
            nzTitle: 'Thêm điều kiện tra cứu',
            nzContent: DieuKienModalComponent,
            nzComponentParams: {
                dataItem: {
                    dinhDuongId: undefined,
                    loaiSoSanh: '',
                    min: undefined,
                    max: undefined,
                    display: '',
                } as DieuKienTraCuuDinhDuongDto,
            },
            nzFooter: null,
        });
        modal.afterClose.subscribe((result: DieuKienTraCuuDinhDuongDto) => {
            if (result) {
                const input = new DieuKienTuyChinhRequest();
                input.loaiSoSanh = loaiSS;
                input.children = [result];
                this.listOfDieuKien.push(input);
                console.log(' this.listOfDieuKien,', this.listOfDieuKien);
                this.onChange(this.listOfDieuKien);
            }
        });
    }

    deleteItemRoot(idx: number) {
        //$('.ant-popover').hide();
        this.listOfDieuKien.splice(idx, 1);
        if (idx === 0) {
            if (this.listOfDieuKien[0]) {
                this.listOfDieuKien[0].loaiSoSanh = '';
            }
        }
        this.onChange(this.listOfDieuKien);
    }

    showChonDieuKienMauModal() {
        const modal = this._modalService.create({
            nzTitle: 'Chọn điều kiện mẫu',
            nzContent: ChonDieuKienMauModalComponent,
            nzComponentParams: {},
            nzFooter: null,
            nzWidth: '50%',
        });

        modal.afterClose.subscribe((result: DieuKienTuyChinhRequest[]) => {
            if (result) {
                this.listOfDieuKien = result;
                this.onChange(this.listOfDieuKien);
            }
        });
    }
}
