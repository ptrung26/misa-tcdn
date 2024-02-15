import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChonChiSoAFModalComponent } from './chon-chi-so-afmodal/chon-chi-so-afmodal.component';
import { CHI_SO_AF, ChiSoAFServiceService } from '@app/shared/customize-comp/chon-chi-so-af/chi-so-afservice.service';
import { ModalHelper } from '@node_modules/@delon/theme';
import { CreateOrEditXaComponent } from '@app/pages/admin/danh-muc/danh-muc-dia-chinh/xa/create-or-edit.component';


const VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChonChiSoAFComponent),
    multi: true,
};

@Component({
    selector: 'chon-chi-so-af',
    template: `
        <div (click)="showChonChiSoAFModal()" class="point">
            <span class="text">
                  {{displayText}}
            </span>
            <span class="margin-left-5">
                <i class="fa fa-pencil" aria-hidden="true"></i>
            </span>
        </div>`,
    styleUrls: ['./chon-chi-so-af.component.scss'],
    providers: [VALUE_ACCESSOR, ChiSoAFServiceService],
})

export class ChonChiSoAFComponent implements OnInit, ControlValueAccessor {
    _value: CHI_SO_AF;
    private onChange: Function = (v: any) => {
    };
    private onTouched: Function = () => {
    };

    @Input() set value(v: CHI_SO_AF) {
        this._value = v;
    }

    get value() {
        return this._value;
    }

    get displayText() {
        return this.chiSoAFService.convertChiSoAFtoValue(this.value);
    }

    showChonChiSoAFModal() {
        this.modalHelper.createStatic(ChonChiSoAFModalComponent, { chiSo: this.value },
            {
                size: 1024,
                includeTabs: true,
                modalOptions: {
                    nzTitle: 'Chọn chỉ số vận động thể lực (AF)',
                },
            })
            .subscribe(result => {
                if (result) {
                    this.value = result;
                    this.onChange(result);
                }
            });

        // const modal = this.modalService.create({
        //     nzTitle: 'Chọn chỉ số vận động thể lực (AF)',
        //     nzContent: ChonChiSoAFModalComponent,
        //     nzWidth: '60%',
        //     nzComponentParams: {
        //         chiSo: this.value
        //     },
        //     nzFooter: null
        // });
        //
        // modal.afterClose.subscribe(result => {
        //     if (result) {
        //         this.value = result;
        //         this.onChange(result);
        //     }
        // });
    }

    constructor(private chiSoAFService: ChiSoAFServiceService,
                private modalHelper: ModalHelper,
    ) {
    }

    ngOnInit(): void {
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }


}
