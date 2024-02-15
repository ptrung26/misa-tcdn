import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditNhomMonAnComponent } from './create-or-edit.component';
import { PagingListNhomCongThucCBInput, NhomMonAnServiceProxy, UploadImgNhomMonAnRequest, NhomMonAnDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UpLoadNhomMonAnModalComponent } from './up-load-nhom-mon-an-modal/up-load-nhom-mon-an-modal.component';
import { AppConsts } from '@shared/AppConsts';
import { ImgTempModalComponent } from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';

@Component({
    templateUrl: './nhom-mon-an.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class NhomMonAnComponent extends PagedListingComponentBase<NhomMonAnDto> implements OnInit {
    rfFormGroup: FormGroup;
    showImgLink = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';
    isHost = false;

    constructor(
        injector: Injector,
        private _dataService: NhomMonAnServiceProxy,
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
        const input: PagingListNhomCongThucCBInput = new PagingListNhomCongThucCBInput();
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

    showCreateOrEditModal(dataItem?: NhomMonAnDto): void {
        this.modalHelper.createStatic(CreateOrEditNhomMonAnComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: dataItem ? 'Sửa thông tin nhóm món ăn: ' + dataItem.tenVi : 'Thêm mới nhóm món ăn',
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

    showEditAnhModal(id: number) {
        this.modalHelper.createStatic(ImgTempModalComponent, { _Id: id },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: 'Sửa ảnh nhóm món ăn',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.updateProfilePicture(result.fileToken, id);
                }
            });
    }

    onClickUpload(data: any) {
        this.modalHelper.create(UpLoadNhomMonAnModalComponent, { dataInput: data },
            {
                size: 1024, includeTabs: true,
                modalOptions: {
                    nzTitle: 'Import danh mục nhóm món ăn',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    exportExcel() {
        // this._dataService.exportExcelNhomMonAn().subscribe(result => {
        //     this._fileService.downloadTempFile(result);
        // });
    }

    updateProfilePicture(fileToken: string, id: number): void {
        const input = new UploadImgNhomMonAnRequest();
        input.fileToken = fileToken;
        input.x = 0;
        input.y = 0;
        input.width = 0;
        input.height = 0;
        input.nhomMonAnId = id;

        this.isTableLoading = true;
        this._dataService.uploadImg(input)
            .pipe(finalize(() => {
                this.isTableLoading = false;
            }))
            .subscribe(() => {
                // abp.event.trigger('profilePictureChanged');
                // this.close(true);
                this.refresh();
            });
    }
}
