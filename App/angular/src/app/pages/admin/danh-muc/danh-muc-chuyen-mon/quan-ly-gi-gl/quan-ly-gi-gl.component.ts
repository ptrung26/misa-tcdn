import { Component, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/common/paged-listing-component-base';
import { FormBuilder, FormGroup } from '@node_modules/@angular/forms';
import { Injector } from '@node_modules/@angular/core';
import { finalize } from '@node_modules/rxjs/operators';
import {
    GetAllGiGlServerPagingOutputDto,
    GetAllGiGlServerPagingRequest,
    ThucPhamServiceProxy,
} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './quan-ly-gi-gl.component.html',
    styleUrls: ['./quan-ly-gi-gl.component.scss'],
})
export class QuanLyGiGlComponent extends PagedListingComponentBase<GetAllGiGlServerPagingOutputDto> implements OnInit {
    rfFormGroup: FormGroup;

    constructor(
        private thucPhamService: ThucPhamServiceProxy,
        private fb: FormBuilder,
        injector: Injector) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            filter: [],
            listNhomThucPhamId: [],
        });
    }

    ngOnInit(): void {
        this.refresh();
    }

    protected fetchDataList(request: PagedRequestDto, pageNumber: number, finishedCallback: () => void): void {
        const input = new GetAllGiGlServerPagingRequest();
        input.maxResultCount = request.maxResultCount;
        input.skipCount = request.skipCount;
        input.sorting = request.sorting;
        const formValue = this.rfFormGroup.value;
        input.filter = formValue.filter;
        input.listNhomThucPhamId = formValue.listNhomThucPhamId;
        this.thucPhamService.getAllGiGlServerPaging(input)
            .pipe(finalize(finishedCallback))
            .subscribe(result => {
                this.dataList = result.items;
                this.showPaging(result);
            });
    }

    delete(dataItem: GetAllGiGlServerPagingOutputDto) {
        this.message.confirm(
            '', 'Bạn có chắc chắn muốn xóa bản ghi này?',
            (isConfirmed) => {
                if (isConfirmed) {
                    this.thucPhamService.deleteGiGlById(dataItem.id)
                        .subscribe(() => {
                            this.refresh();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            },
        );
    }
}
