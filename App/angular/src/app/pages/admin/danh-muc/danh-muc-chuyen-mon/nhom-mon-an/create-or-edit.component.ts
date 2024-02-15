import {Component, Injector, Input, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {NhomMonAnDto, NhomMonAnServiceProxy, UploadImgNhomMonAnRequest} from '@shared/service-proxies/service-proxies';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { AppConsts } from '@shared/AppConsts';
import { ImgTempModalComponent } from '@app/shared/customize-comp/img-temp-modal/img-temp-modal.component';


@Component({
    templateUrl: './create-or-edit.component.html',
})
export class CreateOrEditNhomMonAnComponent extends ModalComponentBase implements OnInit {
    @Input() dataItem: NhomMonAnDto;
    rfDataModal: FormGroup;
    saving = false;
    showImgLink = AppConsts.remoteServiceBaseUrl + '/File/GoToViewImage?imgId=';

    constructor(
        injector: Injector,
        private _dataService: NhomMonAnServiceProxy,
        private fb: FormBuilder,
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.rfDataModal = this.fb.group({
            id: ['0'],
            tenVi: ['', [Validators.required]],
            tenEn: [''],
            tenVietTat: [''],
            loaiNhomMonAn: ['', [Validators.required]],
            isActive:  [true]
        });
        this.rfDataModal.patchValue(this.dataItem);
    }

    save(): void {
        if (this.rfDataModal.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfDataModal.controls) {
                this.rfDataModal.controls[i].markAsDirty();
                this.rfDataModal.controls[i].updateValueAndValidity();
            }
        } else {
            this.saving = true;
            sessionStorage.removeItem('nhom-mon-an');
            this._dataService.createOrUpdate(this.rfDataModal.value)
                .pipe(finalize(() => {
                    this.saving = false;
                }))
                .subscribe(result => {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.success(true);
                });
        }
    }

    showEditAnhModal(id: number) {
        this.modalHelper.createStatic(ImgTempModalComponent, { _Id: id },
            {
                size: 'md', includeTabs: true,
                modalOptions: {
                    nzTitle: 'Sửa ảnh món ăn',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.updateProfilePicture(result.fileToken, id);
                }
            });
    }
    
    updateProfilePicture(fileToken: string, id: number): void {
        const input = new UploadImgNhomMonAnRequest();
        input.fileToken = fileToken;
        input.x = 0;
        input.y = 0;
        input.width = 0;
        input.height = 0;
        input.nhomMonAnId = id;

        this._dataService.uploadImg(input)
            .pipe(finalize(() => {
            }))
            .subscribe(() => {
                // abp.event.trigger('profilePictureChanged');
                // this.close(true);
            });
    }
}
