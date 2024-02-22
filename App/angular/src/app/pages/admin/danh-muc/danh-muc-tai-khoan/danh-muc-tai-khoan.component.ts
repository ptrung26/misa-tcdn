import { DataItem } from '@amcharts/amcharts4/core';
import { Component, Injector, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import {
    DanhMucTaiKhoanDto,
    DanhMucTaiKhoanPagingListRequest,
    DanhMucTaiKhoanServiceProxy,
    ExportDanhMucTaiKhoanRequest,
    IDanhMucTaiKhoanDto,
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { cloneDeep } from 'lodash-es';
import { finalize } from 'rxjs/operators';

export interface ITaiKhoanTree extends IDanhMucTaiKhoanDto {
    level?: number;
    expand?: boolean;
    children?: ITaiKhoanTree[];
}

@Component({
    selector: 'danh-muc-tai-khoan',
    templateUrl: './danh-muc-tai-khoan.component.html',
})
export class DanhMucTaiKhoanComponent extends PagedListingComponentBase<any> implements OnInit {
    showList: number = 1;
    filter: string = '';
    dataItem: DanhMucTaiKhoanDto;

    constructor(injector: Injector, private _dmTaiKhoanService: DanhMucTaiKhoanServiceProxy, private _fileService: FileDownloadService) {
        super(injector);
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new DanhMucTaiKhoanPagingListRequest();
        input.filter = this.filter;
        input.skipCount = request.skipCount;
        input.maxResultCount = request.maxResultCount;

        this._dmTaiKhoanService
            .pagingListRequest(input)
            .pipe(finalize(finishedCallback))
            .subscribe((res) => {
                this.dataList = res.items;
                this.totalItems = res.totalCount;

                const dataTree: ITaiKhoanTree[] = [];
                Object.assign(dataTree, [...this.dataList]);
                const root: ITaiKhoanTree[] = [];
                const map: any = {};
                for (let i = 0; i < dataTree.length; i++) {
                    map[dataTree[i].id] = i;
                    dataTree[i].children = [];
                    dataTree[i].expand = false;
                }
                for (let i = 0; i < dataTree.length; i++) {
                    let node = cloneDeep(dataTree[i]) as ITaiKhoanTree;
                    if (node.parent && map[node.parent.id]) {
                        dataTree[map[node.parent.id]].children.push(node);
                    } else {
                        root.push(node);
                    }
                }
            });
    }

    backList() {
        this.showList = 1;
        this.refresh();
    }

    showCreateOrEditDanhMucTaiKhoan(dataItem?: DanhMucTaiKhoanDto) {
        this.dataItem = dataItem;
        this.showList = 0;
    }

    exportDanhMucTaiKhoan() {
        const input = new ExportDanhMucTaiKhoanRequest();
        input.filter = this.filter;
        input.maxResultCount = this.totalItems;
        input.skipCount = 0;
        this._dmTaiKhoanService
            .exportToExcelRequest(input)
            .pipe(finalize(() => abp.ui.clearBusy()))
            .subscribe((result) => {
                if (result.fileToken) {
                    this.notify.success('Download thành công');
                    this._fileService.downloadTempFile(result);
                } else {
                    this.notify.error('Download thất bại, vui lòng thử lại sau!');
                }
            });
    }
}
