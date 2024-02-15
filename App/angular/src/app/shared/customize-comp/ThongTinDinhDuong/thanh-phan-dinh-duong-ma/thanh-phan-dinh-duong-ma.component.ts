import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, Subscription} from '@node_modules/rxjs';
import * as grDD from './constaint';
import {DinhDuongDto, DinhDuongServiceProxy, ENUM_DINH_DUONG} from '@shared/service-proxies/service-proxies';
import {combineLatest, of, from} from 'rxjs';
import { DinhDuongFrom_ThucPhamOutputExt } from '@app/pages/xay-dung-thuc-don/MonAnExt';

interface IThanhPhanDinhDuong {
    tenDinhDuongVi: string;
    tenHienThi: string;
    tenDinhDuongEn: string;
    tenDonVi: string;
    hamLuong: string | undefined | number;
    slPhanThapPhan: number;
}

interface IThanhPhanDdGroup {
    title: string;
    isDetail: boolean;
    data: IThanhPhanDinhDuong[];
}

@Component({
    selector: 'thanh-phan-dinh-duong-ma',
    templateUrl: './thanh-phan-dinh-duong-ma.component.html',
    styleUrls: ['./thanh-phan-dinh-duong-ma.component.scss']
})
export class ThanhPhanDinhDuongMaComponent implements OnInit, OnDestroy {

    @Input() dinhDuongFromMa$: Subject<DinhDuongFrom_ThucPhamOutputExt[]>;
    unsubscribe: Subscription[] = [];
    isPrintting = false;

    res_NL: IThanhPhanDinhDuong[] = [];
    res_AcidAmin: IThanhPhanDdGroup = {
        title: ' Xem chi tiết các acid amin',
        isDetail: false,
        data: []
    };
    res_NL2: IThanhPhanDinhDuong[] = [];
    res_CacLoaiDuong: any = {
        title: ' Xem chi tiết các loại đường',
        isDetail: false,
        data: []
    };
    res_ChatKhoang: IThanhPhanDinhDuong[] = [];
    res_Vitamin: IThanhPhanDinhDuong[] = [];
    res_Carotenoid: IThanhPhanDdGroup = {
        title: ' Xem chi tiết các carotenoid',
        isDetail: false,
        data: []
    };
    res_Putin: IThanhPhanDinhDuong[] = [];
    res_TongIsofavon: IThanhPhanDinhDuong[] = [];
    res_Isoflavon: IThanhPhanDdGroup = {
        title: ' Xem chi tiết các Isoflavon',
        isDetail: false,
        data: []
    };
    res_TongAcidBeoNo: IThanhPhanDinhDuong[] = [];
    res_AcidBeoNo: IThanhPhanDdGroup = {
        title: ' Xem chi tiết các acid béo no',
        isDetail: false,
        data: []
    };

    res_TongAcidBeoKhongNo1NoiDoi: IThanhPhanDinhDuong[] = [];
    res_AcidBeoKhongNo1NoiDoi: IThanhPhanDdGroup = {
        title: 'Xem chi tiết các acid béo không no 1 nối đôi',
        isDetail: false,
        data: []
    };
    res_TongAcidBeoKhongNoNhieuNoiDoi: IThanhPhanDinhDuong[] = [];
    res_AcidBeoKhongNoNhieuNoiDoi: IThanhPhanDdGroup = {
        title: 'Xem chi tiết các acid béo không no nhiều nối đôi',
        isDetail: false,
        data: []
    };
    res_AcidTrans: IThanhPhanDinhDuong[] = [];
    res_CholesteroL: IThanhPhanDinhDuong[] = [];
    res_Phytosterol: IThanhPhanDinhDuong[] = [];


    constructor(
        private dinhDuongService: DinhDuongServiceProxy,
    ) {
    }

    ngOnInit() {
        const subc = combineLatest(this.dinhDuongService.getAllDinhDuong(), this.dinhDuongFromMa$)
            .subscribe(([resultItem, resultKq]) => {
                console.log('callService_GiaTriDd Chi Tiet');
                this.res_NL = this.getKetQua(grDD.grNL, resultItem, resultKq);
                this.res_AcidAmin.data = this.getKetQua(grDD.grAcidAmin, resultItem, resultKq);
                this.res_NL2 = this.getKetQua(grDD.grNL2, resultItem, resultKq);
                this.res_CacLoaiDuong.data = this.getKetQua(grDD.grCacLoaiDuong, resultItem, resultKq);
                this.res_ChatKhoang = this.getKetQua(grDD.grChatKhoang, resultItem, resultKq);
                this.res_Vitamin = this.getKetQua(grDD.grVitamin, resultItem, resultKq);
                this.res_Carotenoid.data = this.getKetQua(grDD.grCarotenoid, resultItem, resultKq);
                this.res_Putin = this.getKetQua(grDD.grPurtin, resultItem, resultKq);

                this.res_Isoflavon.data = this.getKetQua(grDD.grIsoflavon, resultItem, resultKq);
                this.res_TongIsofavon = this.getKetQua(grDD.grTongIsoflavon, resultItem, resultKq);

                this.res_TongAcidBeoNo = this.getKetQua(grDD.grTongAcidBeoNo, resultItem, resultKq);
                this.res_AcidBeoNo.data = this.getKetQua(grDD.grAcidBeoNo, resultItem, resultKq);

                this.res_AcidBeoKhongNo1NoiDoi.data = this.getKetQua(grDD.grAcidBeoKhongNo1NoiDoi, resultItem, resultKq);
                this.res_TongAcidBeoKhongNo1NoiDoi = this.getKetQua(grDD.grTongAcidBeoKhongNo1NoiDoi, resultItem, resultKq);

                this.res_TongAcidBeoKhongNoNhieuNoiDoi = this.getKetQua(grDD.grTongAcidBeoKhongNoNhieuNoiDoi, resultItem, resultKq);
                this.res_AcidBeoKhongNoNhieuNoiDoi.data = this.getKetQua(grDD.grAcidBeoKhongNoNhieuNoiDoi, resultItem, resultKq);

                this.res_AcidTrans = this.getKetQua(grDD.grAcidTrans, resultItem, resultKq);
                this.res_CholesteroL = this.getKetQua(grDD.grCholesterol, resultItem, resultKq);
                this.res_Phytosterol = this.getKetQua(grDD.grPhytosterol, resultItem, resultKq);
            });
        this.unsubscribe.push(subc);
    }

    getKetQua(grEnum: ENUM_DINH_DUONG[], resultItem: DinhDuongDto[], resultKQ: DinhDuongFrom_ThucPhamOutputExt[]): IThanhPhanDinhDuong[] {
        return grEnum.map(item => {
            const findItem = resultItem.find(x => x.orderBy === item);
            const findKq = resultKQ.find(x => x.codeDinhDuong === item);
            if (findItem) {
                return {
                    tenDinhDuongVi: findItem.tenVi,
                    tenHienThi: findItem.tenHienThi,
                    tenDinhDuongEn: findItem.tenEn,
                    tenDonVi: findItem.strDonViMacDinh,
                    hamLuong: findKq ? findKq.hamLuong_SauTT : '-',
                    slPhanThapPhan: findItem.slPhanThapPhan
                } as IThanhPhanDinhDuong;
            }
        }).filter(x => x);
    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((item) => {
            item.unsubscribe();
        });
    }


}
