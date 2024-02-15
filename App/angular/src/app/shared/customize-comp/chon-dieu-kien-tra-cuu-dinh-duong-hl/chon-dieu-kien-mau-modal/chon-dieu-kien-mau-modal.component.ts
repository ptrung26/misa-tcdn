import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import {
    DieuKienTraCuuDinhDuongDto,
    DieuKienTuyChinhDto,
    DieuKienTuyChinhRequest,
    TraCuuDinhDuongServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { debounceTime, distinctUntilChanged, takeUntil } from '@node_modules/rxjs/internal/operators';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { Subject } from '@node_modules/rxjs';
import { FormControl } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';

@Component({
    selector: 'chon-dieu-kien-mau-modal',
    templateUrl: './chon-dieu-kien-mau-modal.component.html',
    styleUrls: ['./chon-dieu-kien-mau-modal.component.scss'],
})
export class ChonDieuKienMauModalComponent implements OnInit, OnDestroy {
    $destroy = new Subject<boolean>();
    loading = false;
    dataSource: DieuKienTuyChinhDto[] = [];
    source: DieuKienTuyChinhDto[] = [];
    controlFilter: FormControl = new FormControl();
    dieuKienDaChon: DieuKienTuyChinhRequest[];
    tenDkDaChon: string;
    idSelected: number;


    constructor(injector: Injector,
                private modalRef: NzModalRef,
                private _dataService: TraCuuDinhDuongServiceProxy,
    ) {
    }

    ngOnDestroy(): void {
        this.$destroy.next(true);
        this.$destroy.complete();
    }

    ngOnInit(): void {
        this.getDataGrids();
        this.controlFilter.valueChanges.pipe(takeUntil(this.$destroy), debounceTime(300), distinctUntilChanged()).subscribe(result => {
            this.dataSource = this.source.filter(x => AppUtilityService.removeDau(x.ten).indexOf(AppUtilityService.removeDau(result).toLowerCase()) !== -1);
        });

    }

    trackById(index: number, item: any) {
        return item.id;
    }

    getDataGrids(): void {
        this.loading = true;
        this._dataService.getDieuKienTuyChinh()
            .subscribe(data => {
                this.dataSource = data;
                this.source = data;
                this.loading = false;
            });
    }

    close() {
        this.modalRef.destroy();
    }

    onClickRow(dataItem: DieuKienTuyChinhDto) {
        this.dieuKienDaChon = dataItem.dieuKienJson ? JSON.parse(dataItem.dieuKienJson) : [];
        this.tenDkDaChon = dataItem.ten;
        this.idSelected = dataItem.id;
    }

    save() {
        const input = this.dieuKienDaChon.map(dkI => {
            const dk = _.merge(new DieuKienTuyChinhRequest(), dkI);
            dk.children = dk.children.map(item => _.merge(new DieuKienTraCuuDinhDuongDto(), item));
            return dk;
        });
        this.modalRef.destroy(input);
    }

}
