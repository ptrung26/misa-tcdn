import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditNhomChatDinhDuongComponent } from './create-or-edit.component';
import { NhomDinhDuongInputDto, NhomDinhDuongServiceProxy, LOAI_NHOM_DINH_DUONG, NhomDinhDuongDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UpLoadNhomDinhDuongModalComponent } from './up-load-nhom-dinh-duong-modal/up-load-nhom-dinh-duong-modal.component';

@Component({
    templateUrl: './nhom-chat-dinh-duong.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class NhomChatDinhDuongComponent extends PagedListingComponentBase<NhomDinhDuongDto> implements OnInit {
    rfFormGroup: FormGroup;
    LoaiNhomDinhDuong = LOAI_NHOM_DINH_DUONG;

    constructor(
        injector: Injector,
        private _dataService: NhomDinhDuongServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: '',
            isActive: true,
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input: NhomDinhDuongInputDto = new NhomDinhDuongInputDto();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
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

    showCreateOrEditModal(dataItem?: NhomDinhDuongDto): void {
        this.modalHelper.createStatic(CreateOrEditNhomChatDinhDuongComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: dataItem ? 'Sửa thông tin nhóm chất dinh dưỡng: ' + dataItem.tenVi : 'Thêm mới nhóm chất dinh dưỡng',
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
        this.modalHelper.create(UpLoadNhomDinhDuongModalComponent, { dataInput: data },
            {
                size: 1024, includeTabs: true,
                modalOptions: {
                    nzTitle: 'Import danh mục nhóm dinh dưỡng',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    exportExcel() {
        this._dataService.exportExcelNhomDinhDuong().subscribe(result => {
            this._fileService.downloadTempFile(result);
        });
    }
}
