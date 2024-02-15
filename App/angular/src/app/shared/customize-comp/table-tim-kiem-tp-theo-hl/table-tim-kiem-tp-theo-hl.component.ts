import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {
    DinhDuongCoBanDetailDto,
    DinhDuongThucPhamDto, ENUM_DINH_DUONG,
    ExportTraCuuHLTheoLuongTpServiceProxy,
    FileExportServiceProxy, MonAnServiceProxy, ThucPhamServiceProxy,
    TraCuuDinhDuongServiceProxy,
} from '@shared/service-proxies/service-proxies';
import {finalize, map} from '@node_modules/rxjs/internal/operators';
import {FileDownloadService} from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface IFilterTuyChinhHlDd {
    filter?: string;
    khoiLuongPhanAnDuoc: number;
    listOfNhomThucPhamId?: number[];
    listOfThucPhamId?: number[];
    nhomThucPhamId?: number | undefined;
    maxResultCount?: number;
    listOfDieuKien?: IDieuKien[];
}

interface IDieuKien {
    loaiSoSanh: 'and' | 'or' | '';
    children?: IDieuKienChildren[];
}

interface IDieuKienChildren {
    dinhDuongId: number;
    display: string;
    loaiSoSanh: 'and' | 'or' | '';
    max: number;
    min: number;
}

interface IHdeaderDinhDuong {
    dinhDuongId: number;
    tenDinhDuong: string;
    donVi: string;
}

@Component({
    selector: 'table-tim-kiem-tp-theo-hl',
    templateUrl: './table-tim-kiem-tp-theo-hl.component.html',
    styleUrls: ['./table-tim-kiem-tp-theo-hl.component.scss']
})
export class TableTimKiemTpTheoHlComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @Input() showHeader = false;
    @Input() showAction = true;
    @Input() pageSize = 5;
    @ViewChild('refTable', {static: false}) refTable: ElementRef;
    filterView: IFilterTuyChinhHlDd;
    @Output() onSelectRowEvent = new EventEmitter<DinhDuongThucPhamDto>();
    // @Output() onThemThucPhamClick = new EventEmitter<ThucPhamVaHamLuongDDOutputDtoExt>();
    @Output() onThemThucPhamClick = new EventEmitter<any>();
    listHeaderDinhDuong: IHdeaderDinhDuong[] = [];
    listDieuKienFlat: string[] = [];
    showData = false;
    isShowPagination = true;

    constructor(injector: Injector,
                private _fileService: FileDownloadService,
                private fileExportService: FileExportServiceProxy,
                private exportTraCuuHlService: ExportTraCuuHLTheoLuongTpServiceProxy,
                private _appService: TraCuuDinhDuongServiceProxy,
                private modalService: NzModalService,
                private thucPhamService: ThucPhamServiceProxy) {
        super(injector);
        // this.nzTable.pageSize = this.pageSize;
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        // console.log(this.refTable);
    }
    //
    // loadData(filter: IFilterTuyChinhHlDd) {
    //     abp.ui.setBusy();
    //
    //     const input: any = {
    //         ...filter,
    //         skipCount: this.nzTable.getSkipCount(),
    //         maxResultCount: this.nzTable.getMaxResultCount()
    //     };
    //
    //     this._appService.traCuuDinhDuongTuyChinh(input)
    //         .pipe(finalize(() => abp.ui.clearBusy()))
    //         .subscribe(res => {
    //             this.showData = true;
    //             this.nzTable.items = res.items;
    //             this.nzTable.totalCount = res.totalCount;
    //
    //             this.filterView = filter ? filter : {khoiLuongPhanAnDuoc: 0, listOfDieuKien: [], maxResultCount: 10};
    //             const listHeaderDinhDuongTemp: IDieuKienChildren[] = [];
    //             const listDieuKienFlatTemp: string[] = [];
    //             if (this.filterView.listOfDieuKien) {
    //                 this.filterView.listOfDieuKien.forEach((dk, index) => {
    //                     if (dk.loaiSoSanh === 'and') {
    //                         listDieuKienFlatTemp[index] = ' và ';
    //                     } else if (dk.loaiSoSanh === 'or') {
    //                         listDieuKienFlatTemp[index] = ' hoặc ';
    //                     } else {
    //                         listDieuKienFlatTemp[index] = '';
    //                     }
    //                     dk.children.forEach(child => {
    //                         if (child.loaiSoSanh === 'and') {
    //                             listDieuKienFlatTemp[index] += ' và ';
    //                         } else if (child.loaiSoSanh === 'or') {
    //                             listDieuKienFlatTemp[index] += ' hoặc ';
    //                         }
    //                         listDieuKienFlatTemp[index] += child.display;
    //                         // tslint:disable-next-line:triple-equals
    //                         if (listHeaderDinhDuongTemp.findIndex(x => x.dinhDuongId == child.dinhDuongId) > -1) {
    //
    //                         } else {
    //                             listHeaderDinhDuongTemp.push(child);
    //                         }
    //                     });
    //                 });
    //             }
    //             const itemLstTpddFirst = this.nzTable.items[0] ? this.nzTable.items[0].thanhPhanDinhDuong : [];
    //             const header = listHeaderDinhDuongTemp.map(item => {
    //                 // tslint:disable-next-line:triple-equals
    //                 const itemFind = itemLstTpddFirst.find((x => x.dinhDuongId == item.dinhDuongId));
    //                 if (itemFind) {
    //                     return {
    //                         dinhDuongId: itemFind.dinhDuongId,
    //                         tenDinhDuong: itemFind.tenDinhDuong,
    //                         donVi: itemFind.maDonVi
    //                     };
    //                 } else {
    //                     return null;
    //                 }
    //             }).filter(x => x !== null);
    //
    //             this.listHeaderDinhDuong = header ? header : [];
    //             this.listDieuKienFlat = listDieuKienFlatTemp;
    //
    //             const ddTpTemp = this.nzTable.items.map(ddtp => {
    //                 if (ddtp.thanhPhanDinhDuong) {
    //                     ddtp.thanhPhanDinhDuong = this.listHeaderDinhDuong.map(item => {
    //                         const findItem = ddtp.thanhPhanDinhDuong.find(x => x.dinhDuongId === item.dinhDuongId);
    //                         if (findItem) {
    //                             return findItem;
    //                         } else {
    //                             const res = new DinhDuongCoBanDetailDto();
    //                             res.hamLuong = 0;
    //                             return res;
    //                         }
    //                     });
    //                 } else {
    //                     ddtp.thanhPhanDinhDuong = [];
    //                 }
    //                 return ddtp;
    //             });
    //             this.nzTable.items = ddTpTemp;
    //         });
    //
    //
    // }
    //
    // onPrintClick() {
    //     abp.ui.setBusy();
    //     const input: any = {
    //         ...this.filterView,
    //         fileType: 'pdf'
    //     };
    //     this.exportTraCuuHlService.exportTraCuuTheoLuongTp(input)
    //         .pipe(finalize(() => abp.ui.clearBusy()))
    //         .subscribe(response => {
    //             this.fileExportService.getFile(response.fileToken).subscribe(result => {
    //                 this.pdfService.printFilePdf(result);
    //             });
    //         });
    // }
    //
    // onDownloadClick() {
    //     abp.ui.setBusy();
    //     const input: any = {
    //         ...this.filterView,
    //         fileType: 'xlsx'
    //     };
    //     this.exportTraCuuHlService.exportTraCuuTheoLuongTp(input).pipe(finalize(() => abp.ui.clearBusy())).subscribe(response => {
    //         this._fileService.downloadTempFile(response);
    //     });
    // }
    //
    //
    // selectThucPhamViewDetail(dataItem: DinhDuongThucPhamDto) {
    //     this.onSelectRowEvent.emit(dataItem);
    // }
    //
    // onPageChange(reset: boolean) {
    //     this.nzTable.shouldResetPaging(reset);
    //     this.loadData(this.filterView);
    //     // this.changePageEvent.emit(this.nzTable);
    // }
    //
    // getWidthTh(dinhDuongVi: string) {
    //     const minWidth = 90;
    //     const arr = dinhDuongVi.split(' ');
    //     let indexmax = 0;
    //     let maxValue = 0;
    //     arr.forEach((item, index) => {
    //         if (item.length > maxValue) {
    //             maxValue = item.length;
    //             indexmax = index;
    //         }
    //     });
    //     return (maxValue * 9 > minWidth ? maxValue * 9 : minWidth) + 'px';
    // }
    //
    // xemChiTietTp(thucPhamId: number) {
    //     this.thucPhamService.getInfoThucPhamTKTDRequest(thucPhamId)
    //         .pipe(map((item) => _.merge(new ThucPhamVaHamLuongDDOutputDtoExt(), item)))
    //         .subscribe(result => {
    //             const dataTemp: ThucPhamFromMaDtoExt = new ThucPhamFromMaDtoExt();
    //             dataTemp.thucPham = result;
    //             dataTemp.khoiLuong = 100;
    //             dataTemp.khoiLuongGam = 100;
    //             dataTemp.update();
    //
    //             let lstDam: DinhDuongFrom_ThucPhamOutputExt[] = dataTemp.thucPham.dinhDuong.filter(x => x.codeDinhDuong === ENUM_DINH_DUONG.Dam);
    //             let lstBotDuong: DinhDuongFrom_ThucPhamOutputExt[] = dataTemp.thucPham.dinhDuong.filter(x => x.codeDinhDuong === ENUM_DINH_DUONG.ChatBotDuong);
    //             let lstChatBeo: DinhDuongFrom_ThucPhamOutputExt[] = dataTemp.thucPham.dinhDuong.filter(x => x.codeDinhDuong === ENUM_DINH_DUONG.ChatBeo);
    //             let lstAlco: DinhDuongFrom_ThucPhamOutputExt[] = dataTemp.thucPham.dinhDuong.filter(x => x.codeDinhDuong === ENUM_DINH_DUONG.Alcohol);
    //
    //             const slDam = lstDam.reduce((pre, cur) => pre + cur.hamLuong_SauTT, 0);
    //             const slBotDuong = lstBotDuong.reduce((pre, cur) => pre + cur.hamLuong_SauTT, 0);
    //             const slChatBeo = lstChatBeo.reduce((pre, cur) => pre + cur.hamLuong_SauTT, 0);
    //             const slAlco = lstAlco.reduce((pre, cur) => pre + cur.hamLuong_SauTT, 0);
    //
    //             const damItem = _.merge(new DinhDuongWithNangLuong(), lstDam[0]);
    //             const cbeoItem = _.merge(new DinhDuongWithNangLuong(), lstChatBeo[0]);
    //             const bdItem = _.merge(new DinhDuongWithNangLuong(), lstBotDuong[0]);
    //             const alcoItem = _.merge(new DinhDuongWithNangLuong(), lstAlco[0]);
    //
    //             damItem.nangLuong = slDam * 4;
    //             cbeoItem.nangLuong = slChatBeo * 9;
    //             bdItem.nangLuong = slBotDuong * 4;
    //             alcoItem.nangLuong = slAlco * 7;
    //
    //             const calTotal = damItem.nangLuong + cbeoItem.nangLuong + bdItem.nangLuong + alcoItem.nangLuong;
    //
    //             damItem.tyLe = calTotal ? (damItem.nangLuong / calTotal * 100) : 0;
    //             cbeoItem.tyLe = calTotal ? (cbeoItem.nangLuong / calTotal * 100) : 0;
    //             bdItem.tyLe = calTotal ? (bdItem.nangLuong / calTotal * 100) : 0;
    //             alcoItem.tyLe = calTotal ? (alcoItem.nangLuong / calTotal * 100) : 0;
    //
    //             this.modalService.create({
    //                 nzTitle: ` Hàm lượng dinh dưỡng thực phẩm trong ${dataTemp.thucPham.tenThucPhamVi}`,
    //                 nzContent: ChiTietThucPhamModalComponent,
    //                 nzWidth: '60%',
    //                 nzComponentParams: {
    //                     hinhAnhId: dataTemp.thucPham.imgBinaryObjectId,
    //                     titleAnh: dataTemp.thucPham.tenThucPhamVi,
    //                     moTaAnh: dataTemp.thucPham.tenThucPhamEn,
    //                     dinhDuongFromMa$: of(dataTemp.thucPham.dinhDuong),
    //                     nangLuong$: of(dataTemp.thucPham.nangLuongKcal_SauTT),
    //                     ttBotDuong$: of(bdItem),
    //                     ttChatBeo$: of(cbeoItem),
    //                     ttDam$: of(damItem),
    //                     ttAlco$: of(alcoItem),
    //                 },
    //                 nzFooter: null
    //             });
    //         });
    //
    //
    // }
    //
    // themThucPham(thucPhamId: number) {
    //     abp.ui.setBusy();
    //     this.thucPhamService.getInfoThucPhamTKTDRequest(thucPhamId)
    //         .pipe(map((item) => _.merge(new ThucPhamVaHamLuongDDOutputDtoExt(), item)))
    //         .subscribe(dataTemp => {
    //             abp.ui.clearBusy();
    //             console.log('thucPHamADD', dataTemp);
    //             this.onThemThucPhamClick.emit(dataTemp);
    //         });
    // }
}
