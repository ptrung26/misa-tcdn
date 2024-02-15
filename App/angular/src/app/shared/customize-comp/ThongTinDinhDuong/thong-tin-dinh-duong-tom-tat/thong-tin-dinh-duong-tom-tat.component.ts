import {Component, OnInit, Input} from '@angular/core';
import {BehaviorSubject, Subject} from '@node_modules/rxjs';
import {AppConsts} from '@shared/AppConsts';
import { DinhDuongWithNangLuong } from '@app/pages/xay-dung-thuc-don/MonAnExt';

const imgLinkBase: string = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';

@Component({
    selector: 'thong-tin-dinh-duong-tom-tat',
    templateUrl: './thong-tin-dinh-duong-tom-tat.component.html',
    styleUrls: ['./thong-tin-dinh-duong-tom-tat.component.scss']
})
export class ThongTinDinhDuongTomTatComponent implements OnInit {

    // @Input() hinhAnhId: string;
    @Input() moTaAnh: string;
    @Input() moTaAnh2: string;
    @Input() titleAnh: string;
    @Input() ttDam$: Subject<DinhDuongWithNangLuong>;
    @Input() ttChatBeo$: Subject<DinhDuongWithNangLuong>;
    @Input() ttBotDuong$: Subject<DinhDuongWithNangLuong>;
    @Input() ttAlco$: Subject<DinhDuongWithNangLuong>;
    @Input() nangLuong$: Subject<any>;
    // @Input() ttChatSo$: BehaviorSubject<DinhDuongWithNangLuong>;
    @Input() srcImgDefault = '/assets/common/icon/notFoundMonAn.svg';
    @Input() isShowAnh = true;
    @Input() showLegendBD = true;

    _imgLink: string = this.srcImgDefault;

    @Input() set hinhAnhId(v: string) {
        if (v) {
            this._imgLink = imgLinkBase + v;
        } else {
            this._imgLink = this.srcImgDefault;
        }
    }

    constructor() {

    }

    ngOnInit() {

    }
}
