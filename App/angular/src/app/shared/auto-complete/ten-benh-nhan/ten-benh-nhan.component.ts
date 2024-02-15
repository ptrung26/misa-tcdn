import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuanLyThanhVienServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';

@Component({
    selector: 'ten-benh-nhan-auto-complete',
    templateUrl: './ten-benh-nhan.component.html',
    styleUrls: ['./ten-benh-nhan.component.css']
})
export class TenBenhNhanComponent implements OnInit {
    listOfData: any[] = [];
    _value = '';
    options: Array<any> = [];
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

    @Output() valueChange = new EventEmitter();

    constructor(private _benhNhanSerP: QuanLyThanhVienServiceProxy) {
    }

    ngOnInit() {
        this._benhNhanSerP.getTenBenhNhanAutoCompeleteData().subscribe(d => {
            this.listOfData = d;
            this.listOfData.forEach(it => {
                it.fts = `${it.tenBenhNhan}`;
                it.fts = AppUtilityService.removeDau(it.fts).replace(/y/g, 'i');
            });
        });
    }

    onChange(e: Event): void {
        const value = (e.target as HTMLInputElement).value;
        if (AppUtilityService.isNullOrEmpty(value)) {
            this.options = [];
            return;
        }
        let fts = AppUtilityService.removeDau(value).replace(/y/g, 'i');
        this.options = this.listOfData.filter(it => {
            return it.fts.indexOf(fts) > -1;
        });
    }
}
