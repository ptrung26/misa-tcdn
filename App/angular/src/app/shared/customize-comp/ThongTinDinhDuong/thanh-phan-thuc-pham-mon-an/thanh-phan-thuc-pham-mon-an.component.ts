import { Component, Input, OnInit } from '@angular/core';
import { ThucPhamFromMaDtoExt } from '@app/pages/xay-dung-thuc-don/MonAnExt';

interface IDataSource {
    tenThucPham: string;
    khoiLuongSong?: number;
    khoiLuongDiCho?: number;
    slPhanThapPhan?: number;
    donVi?: string;
    nangLuongKcal?: number;
}

@Component({
    selector: 'thanh-phan-thuc-pham-mon-an',
    templateUrl: './thanh-phan-thuc-pham-mon-an.component.html',
    styleUrls: ['./thanh-phan-thuc-pham-mon-an.component.scss'],
})
export class ThanhPhanThucPhamMonAnComponent implements OnInit {

    dataSource: IDataSource[] = [];

    @Input() set thanhPhanThucPham(v: ThucPhamFromMaDtoExt[]) {
        this.dataSource = v ? v.map(data => {
            const res: IDataSource = {
                tenThucPham: data.thucPham.tenThucPhamVi,
                nangLuongKcal: data.thucPham.nangLuongKcal_SauTT,
                slPhanThapPhan: data.thucPham.soLuongPhanThapPhan,
            };

            res.khoiLuongSong = data.khoiLuong;
            const ktkp = data.thucPham.kichThuocKhauPhan.find(x => x.id === data.kichThuocKhauPhanId);
            res.donVi = ktkp ? ktkp.tenDonVi : 'g';
            res.khoiLuongDiCho = data.khoiLuongTpDiCho;

            return res;
        }) : [];
    }

    constructor() {
    }

    ngOnInit(): void {
    }

}
