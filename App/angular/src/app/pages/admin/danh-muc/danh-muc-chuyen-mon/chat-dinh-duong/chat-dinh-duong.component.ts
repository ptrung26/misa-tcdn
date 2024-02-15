import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditChatDinhDuongComponent } from './create-or-edit.component';
import { DinhDuongDto, DinhDuongInputDto, DinhDuongServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UpLoadDinhDuongModalComponent } from './up-load-dinh-duong-modal/up-load-dinh-duong-modal.component';

@Component({
    templateUrl: './chat-dinh-duong.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class ChatDinhDuongComponent extends PagedListingComponentBase<DinhDuongDto> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        injector: Injector,
        private _dataService: DinhDuongServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            nhomDinhDuongId: '',
            isActive: true,
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: DinhDuongInputDto = new DinhDuongInputDto();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.nhomDinhDuongId = formValue.nhomDinhDuongId;
        this._dataService.getAllServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    clear() {
        this.rfFormGroup.reset();
        this.refresh();
    }

    showCreateOrEditModal(dataItem?: DinhDuongDto): void {
        this.modalHelper.createStatic(CreateOrEditChatDinhDuongComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: dataItem ? 'Sửa thông tin chất dinh dưỡng: ' + dataItem.tenVi : 'Thêm mới chất dinh dưỡng',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    delete(dataItem: any): void {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa bản ghi này?',
            (isConfirmed) => {
                if (isConfirmed) {
                    this._dataService.delete(dataItem.id)
                        .subscribe(() => {
                            this.refresh();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }

    onClickUpload(data: any) {
        this.modalHelper.create(UpLoadDinhDuongModalComponent, { dataInput: data },
            {
                size: 1024, includeTabs: true,
                modalOptions: {
                    nzTitle: 'Import danh mục chất dinh dưỡng',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    exportExcel() {
        let nddId = this.rfFormGroup.value.nhomDinhDuongId === '' ? 0 : parseInt(this.rfFormGroup.value.nhomDinhDuongId)
        this._dataService.exportExcelDinhDuong(nddId).subscribe(result => {
            this._fileService.downloadTempFile(result);
        });
    }
}
