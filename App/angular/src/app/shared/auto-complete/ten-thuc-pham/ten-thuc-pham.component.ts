import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ThucPhamServiceProxy} from '@shared/service-proxies/service-proxies';
import {AppUtilityService} from '@app/shared/common/custom/utility.service';

@Component({
    selector: 'ten-thuc-pham-auto-complete',
    templateUrl: './ten-thuc-pham.component.html',
    styleUrls: ['./ten-thuc-pham.component.css']
})
export class TenThucPhamComponent implements OnInit {
    listOfData: any[] = [];
    inputValue?: string;
    options: Array<any> = [];
    @Output() valueChange = new EventEmitter();

    constructor(private _thucPhamSerP: ThucPhamServiceProxy) {
    }

    ngOnInit() {
        this._thucPhamSerP.getTenThucPhamAutoCompeleteData().subscribe(d => {
            this.listOfData = d;
            this.listOfData.forEach(it => {
                it.fts = `${it.tenThucPham}`;
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
