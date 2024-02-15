import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateOrEditNhomThucPhamComponent } from './create-or-edit.component';
import { DanhMucNhomThucPham_PagingListQuery, DanhMucNhomThucPhamServiceProxy, UploadImgNhomTPRequest, NhomThucPhamDto } from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { finalize } from '@node_modules/rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { ImgTempModalComponent } from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { UpLoadNhomThucPhamModalComponent } from './up-load-nhom-thuc-pham-modal/up-load-nhom-thuc-pham-modal.component';

@Component({
    templateUrl: './nhom-thuc-pham.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class NhomThucPhamComponent extends PagedListingComponentBase<NhomThucPhamDto> implements OnInit {
    rfFormGroup: FormGroup;
    showImgLink = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';

    constructor(
        private _dataService: DanhMucNhomThucPhamServiceProxy,
        private _fileService: FileDownloadService,
        private fb: FormBuilder,
        injector: Injector,
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
        const input: DanhMucNhomThucPham_PagingListQuery = new DanhMucNhomThucPham_PagingListQuery();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        this._dataService.pagingList(input)
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

    showCreateOrEditModal(dataItem?: NhomThucPhamDto): void {
        this.modalHelper.createStatic(CreateOrEditNhomThucPhamComponent, { dataItem: dataItem ? dataItem : {} },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: dataItem ? 'Sửa thông tin nhóm thực phẩm: ' + dataItem.tenVi : 'Thêm mới nhóm thực phẩm',
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
                    nzTitle: 'Sửa ảnh nhóm thực phẩm',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.updateProfilePicture(result.fileToken, id);
                }
            });
    }

    onClickUpload(data: any) {
        this.modalHelper.create(UpLoadNhomThucPhamModalComponent, { dataInput: data },
            {
                size: 1024, includeTabs: true,
                modalOptions: {
                    nzTitle: 'Import danh mục nhóm thực phẩm',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.refresh();
                }
            });
    }

    exportExcel() {
        this._dataService.exportExcelNhomThucPham().subscribe(result => {
            this._fileService.downloadTempFile(result);
        });
    }

    updateProfilePicture(fileToken: string, id: number): void {
        const input = new UploadImgNhomTPRequest();
        input.fileToken = fileToken;
        input.x = 0;
        input.y = 0;
        input.width = 0;
        input.height = 0;
        input.nhomThucPhamId = id;

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
