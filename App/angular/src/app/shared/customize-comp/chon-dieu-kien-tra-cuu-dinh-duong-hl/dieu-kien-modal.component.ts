import { Component, EventEmitter, Injector, OnInit, Output, ViewEncapsulation, Input } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
    ComboboxItemDto,
    DieuKienTraCuuDinhDuongDto,
    DinhDuongServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { AppUtilityService } from '@app/shared/common/custom/utility.service';
import { map } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { isNotNullOrUndefined } from '@node_modules/codelyzer/util/isNotNullOrUndefined';
import { NzModalRef } from '@node_modules/ng-zorro-antd/modal';

// export interface IDieuKienDinhDuongDto {
//     dinhDuongId: string;
//     min: Number;
//     max: Number;
//     display: string;
//     loaiSoSanh: string;
// }

@Component({
    templateUrl: './dieu-kien-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})

export class DieuKienModalComponent extends AppComponentBase implements OnInit {
    @Input() dataItem: DieuKienTraCuuDinhDuongDto;

    rfFormGroup: FormGroup;
    enumNangLuongId = '-10';
    dinhDuongOptionList: ComboboxItemDto[] = [];
    dinhDuongOptionListSource: ComboboxItemDto[] = [];

    @Output() dieuKienOutput = new EventEmitter();
    // tslint:disable-next-line:triple-equals
    compareFn = (o1: ComboboxItemDto, o2: ComboboxItemDto) => (o1 && o2 ? o1.value == o2.value : o1 == o2);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private _comboboxService: DataCommonService,
        private  _dataService: DinhDuongServiceProxy,
        private _modalRef: NzModalRef,
    ) {
        super(injector);
        this.rfFormGroup = this.fb.group({
            dinhDuong: [undefined, [Validators.required]],
            donVi: [''],
            min: [undefined],
            max: [undefined],
        }, {
            validators: [(contr) => {
                const v = contr.value;
                if (!_.isNumber(v.min) && !_.isNumber(v.max)) {
                    return { error: true, required: true };
                } else if (_.isNumber(v.min) && _.isNumber(v.max) && v.min > v.max) {
                    return { error: true, errMinMax: true };
                }
            }],
        });
        this.rfFormGroup.get('dinhDuong').valueChanges.subscribe(result => {
            if (result) {
                if (result.value === this.enumNangLuongId) {
                    this.rfFormGroup.get('donVi').setValue('Kcal');
                } else {
                    this._dataService.getDonViByDinhDuong(result.value).subscribe(result => {
                        this.rfFormGroup.get('donVi').setValue(result.ma);
                    });

                }
            }

        });
    }

    ngOnInit() {
        this._comboboxService.getComboboxDataObs<ComboboxItemDto>('dinhDuongServiceProxy.comboBoxData', this._dataService.comboBoxData())
            .pipe(map((item) =>
                [...item, {
                    displayText: 'Năng lượng',
                    value: this.enumNangLuongId,
                } as ComboboxItemDto],
            )).subscribe(result => {
            this.dinhDuongOptionListSource = result;
            this.dinhDuongOptionList = this.dinhDuongOptionListSource;
            // @ts-ignore
            // tslint:disable-next-line:triple-equals
            const objDd = result.find(x => x.value == this.dataItem.dinhDuongId);
            this.rfFormGroup.patchValue({
                dinhDuong: objDd,
                min: this.dataItem.min,
                max: this.dataItem.max,
            });
        });

    }


    handleOk(): void {
        if (this.rfFormGroup.invalid) {
            this.notify.error('Vui lòng xem lại thông tin form');
            // tslint:disable-next-line:forin
            for (const i in this.rfFormGroup.controls) {
                this.rfFormGroup.controls[i].markAsDirty();
                this.rfFormGroup.controls[i].updateValueAndValidity();
            }
        } else {
            const fValue = this.rfFormGroup.value;
            console.log('formvalue', fValue);
            let displayText = '';
            if (_.isNumber(fValue.min) && !_.isNumber(fValue.max)) {
                displayText = `${fValue.dinhDuong.displayText} ≥ ${fValue.min}${fValue.donVi}`;
            } else if (!_.isNumber(fValue.min) && _.isNumber(fValue.max)) {
                displayText = `${fValue.dinhDuong.displayText} ≤ ${fValue.max}${fValue.donVi}`;
            } else if (fValue.max === fValue.min) {
                displayText = `${fValue.dinhDuong.displayText} = ${fValue.max}${fValue.donVi}`;
            } else {
                displayText = `${fValue.dinhDuong.displayText} (${fValue.min}-${fValue.max})${fValue.donVi}`;
            }
            const val = {
                max: fValue.max,
                min: fValue.min,
                display: displayText,
                dinhDuongId: fValue.dinhDuong.value,
                loaiSoSanh: this.dataItem.loaiSoSanh,
            };

            this._modalRef.destroy(_.merge(new DieuKienTraCuuDinhDuongDto(), val));
        }
    }


    handleCancel(): void {
        this._modalRef.destroy();
    }

    searchDinhDuongCombo(value: string): void {
        value = AppUtilityService.removeDau(value);
        this.dinhDuongOptionList = this.dinhDuongOptionListSource.filter((s) => AppUtilityService.removeDau(s.displayText.toLowerCase()).indexOf(value.toLowerCase()) !== -1);
    }
}
