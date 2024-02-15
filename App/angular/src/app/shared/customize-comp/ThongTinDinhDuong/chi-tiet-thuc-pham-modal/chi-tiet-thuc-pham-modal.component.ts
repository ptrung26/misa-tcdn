import {Component, Injector, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Observable} from '@node_modules/rxjs';
import {
    DinhDuongFrom_ThucPhamOutputExt,
    DinhDuongWithNangLuong,
    ThucPhamFromMaDtoExt,
} from '@app/pages/xay-dung-thuc-don/MonAnExt';
import { ModalComponentBase } from '@shared/common/modal-component-base';



@Component({
    templateUrl: './chi-tiet-thuc-pham-modal.component.html',
})

export class ChiTietThucPhamModalComponent extends ModalComponentBase implements OnInit {
    @Input() isShowAnh = true;
    @Input() hinhAnhId: string;
    @Input() titleAnh: string;
    @Input() moTaAnh: string;
    @Input() moTaAnh2: string;
    @Input() ttDam$: Observable<DinhDuongWithNangLuong>;
    @Input() ttChatBeo$: Observable<DinhDuongWithNangLuong>;
    @Input() ttBotDuong$: Observable<DinhDuongWithNangLuong>;
    @Input() ttAlco$: Observable<DinhDuongWithNangLuong>;
    // @Input() ttChatSo$: Observable<DinhDuongWithNangLuong>;
    @Input() srcImgDefault = '/assets/common/icon/notFoundMonAn.svg';

    @Input() nangLuong$: Observable<any>;
    @Input() dinhDuongFromMa$: Observable<DinhDuongFrom_ThucPhamOutputExt[]>;
    @Input() thanhPhanThucPham: ThucPhamFromMaDtoExt[];
    @Input() showLegendBD = true;

    rfDataModal: FormGroup;
    nzLabel = 8;
    nzForm = 16;
    saving = false;

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }


}
