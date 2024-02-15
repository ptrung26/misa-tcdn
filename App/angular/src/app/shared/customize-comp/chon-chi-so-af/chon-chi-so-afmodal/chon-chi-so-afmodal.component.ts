import {Component, OnInit, Input} from '@angular/core';
import { ModalComponentBase } from '@shared/common/modal-component-base';
import { Injector } from '@node_modules/@angular/core';
import { CHI_SO_AF } from '@app/shared/customize-comp/chon-chi-so-af/chi-so-afservice.service';

@Component({
    templateUrl: './chon-chi-so-afmodal.component.html',
    styleUrls: ['./chon-chi-so-afmodal.component.scss']
})
export class ChonChiSoAFModalComponent extends ModalComponentBase implements OnInit {
    chiSoAF = CHI_SO_AF;
    @Input() chiSo: CHI_SO_AF;

    constructor( injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
    }


    changeValue(chiSo: CHI_SO_AF) {
        this.success(chiSo)
    }
}
