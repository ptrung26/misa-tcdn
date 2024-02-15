import { NgModule } from '@angular/core';
import { TinhComboComponent } from './combobox-filter/tinh-combo.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {NgSelectModule} from '@ng-select/ng-select';
import { HuyenComboComponent } from './combobox-filter/huyen-combo.component';
import { DataCommonService } from '@app/shared/data-common/data-common.service';
import { XaComboComponent } from './combobox-filter/xa-combo.component';
import { OraSelectComponent } from './combobox-filter/ora-select/ora-select.component';
import { CustomizeCompModule } from '@app/shared/customize-comp/customize-comp.module';
import { OraRadioComponent } from './combobox-filter/ora-select/ora-radio.component';
import { QuocTichComboComponent } from './combobox-filter/quoc-tich-combo.component';
import { CustomSourceDirective } from './combobox-filter/ora-select/directive/customSource.directive';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';

const componentsEx = [
    OraSelectComponent,
    OraRadioComponent,
    TinhComboComponent,
    HuyenComboComponent,
    XaComboComponent,
    QuocTichComboComponent,
    CustomSourceDirective,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ...SHARED_ZORRO_MODULES,
        CustomizeCompModule,
    ],
    declarations: [...componentsEx],
    exports: [...componentsEx],
    providers: [DataCommonService],
})
export class DataCommonModule {
}
